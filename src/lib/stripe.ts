import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const PLANS = {
  free: {
    name: '無料プラン',
    price: 0,
    priceId: '', // Stripeの価格ID（無料プランなので不要）
    features: [
      'AI画像生成 月2枚まで',
      'AI動画生成 月1本まで',
      '基本テンプレート'
    ],
    limits: {
      image: 2,
      video: 1
    }
  },
  premium: {
    name: 'プレミアムプラン',
    price: 2980,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID!, // Stripeで作成した価格ID
    features: [
      'AI画像生成 無制限',
      'AI動画生成 無制限',
      'プレミアムテンプレート',
      '優先サポート',
      '高解像度出力'
    ],
    limits: {
      image: null, // 無制限
      video: null  // 無制限
    }
  }
}

export async function createCheckoutSession(
  userId: string,
  plan: 'premium',
  email: string
) {
  const planConfig = PLANS[plan]
  
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    billing_address_collection: 'required',
    line_items: [
      {
        price: planConfig.priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?cancelled=true`,
    metadata: {
      userId,
      plan,
    },
  })

  return session
}

export async function createPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  })

  return session
}

export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      return handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
    
    case 'customer.subscription.updated':
      return handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
    
    case 'customer.subscription.deleted':
      return handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
    
    case 'invoice.payment_failed':
      return handlePaymentFailed(event.data.object as Stripe.Invoice)
    
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { userId, plan } = session.metadata!
  
  if (!userId || !plan) {
    throw new Error('Missing metadata in checkout session')
  }

  // サブスクリプション情報を取得
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
  
  // データベースを更新
  const { prisma } = await import('./prisma')
  
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      plan,
      status: 'active',
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    create: {
      userId,
      plan,
      status: 'active',
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { prisma } = await import('./prisma')
  
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { prisma } = await import('./prisma')
  
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      plan: 'free',
      status: 'cancelled',
    },
  })
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const { prisma } = await import('./prisma')
  
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: invoice.subscription as string },
    data: {
      status: 'past_due',
    },
  })
}