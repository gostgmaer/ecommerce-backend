paypal.configure({
    mode: 'sandbox', // Change to 'live' for production
    client_id: config.paypal.clientId,
    client_secret: config.paypal.clientSecret,
  });