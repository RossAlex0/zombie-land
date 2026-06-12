# Test weebhooks (Linux) :

Sur 2 terminaux différents :

stripe listen --forward-to localhost:3000/api/webhook/stripe
stripe trigger checkout.session.completed

# Doc links :

https://docs.stripe.com/checkout/quickstart?client=next

https://docs.stripe.com/payments/accept-a-payment

https://docs.stripe.com/api/checkout/sessions/create#create_checkout_session-line_items-price_data

# Stripe CLI

https://docs.stripe.com/stripe-cli
