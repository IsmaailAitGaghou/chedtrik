import paypal from '@paypal/checkout-server-sdk';

// Configuration PayPal
const environment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (process.env.PAYPAL_MODE === 'production') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  }
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
};

const client = () => {
  return new paypal.core.PayPalHttpClient(environment());
};

// @desc    Créer un ordre PayPal
// @route   POST /api/payments/create-order
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'EUR', description = 'Location de voiture ChedTri9' } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Montant requis'
      });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toFixed(2)
        },
        description: description
      }],
      application_context: {
        brand_name: 'ChedTri9',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL}/payment-success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`
      }
    });

    const order = await client().execute(request);

    res.status(200).json({
      success: true,
      data: {
        orderId: order.result.id,
        status: order.result.status,
        links: order.result.links
      }
    });
  } catch (error) {
    console.error('Erreur création ordre PayPal:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'ordre PayPal',
      error: error.message
    });
  }
};

// @desc    Capturer un paiement PayPal
// @route   POST /api/payments/capture-order
// @access  Private
export const captureOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'ID de commande requis'
      });
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await client().execute(request);

    res.status(200).json({
      success: true,
      data: {
        orderId: capture.result.id,
        status: capture.result.status,
        payerId: capture.result.payer.payer_id,
        payerEmail: capture.result.payer.email_address,
        captureId: capture.result.purchase_units[0].payments.captures[0].id,
        amount: capture.result.purchase_units[0].payments.captures[0].amount
      }
    });
  } catch (error) {
    console.error('Erreur capture paiement PayPal:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la capture du paiement PayPal',
      error: error.message
    });
  }
};

// @desc    Obtenir les détails d'un ordre PayPal
// @route   GET /api/payments/order/:orderId
// @access  Private
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const request = new paypal.orders.OrdersGetRequest(orderId);
    const order = await client().execute(request);

    res.status(200).json({
      success: true,
      data: order.result
    });
  } catch (error) {
    console.error('Erreur récupération ordre PayPal:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des détails de l\'ordre',
      error: error.message
    });
  }
};

// @desc    Rembourser un paiement PayPal
// @route   POST /api/payments/refund
// @access  Private/Admin
export const refundPayment = async (req, res) => {
  try {
    const { captureId, amount, currency = 'EUR', note } = req.body;

    if (!captureId) {
      return res.status(400).json({
        success: false,
        message: 'ID de capture requis'
      });
    }

    const request = new paypal.payments.CapturesRefundRequest(captureId);
    request.requestBody({
      amount: amount ? {
        value: amount.toFixed(2),
        currency_code: currency
      } : undefined,
      note_to_payer: note || 'Remboursement de votre réservation ChedTri9'
    });

    const refund = await client().execute(request);

    res.status(200).json({
      success: true,
      data: {
        refundId: refund.result.id,
        status: refund.result.status,
        amount: refund.result.amount
      }
    });
  } catch (error) {
    console.error('Erreur remboursement PayPal:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du remboursement PayPal',
      error: error.message
    });
  }
};
