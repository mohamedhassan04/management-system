export const getReminderEmailTemplate = (
  clientName: string,
  numInvoice: string,
  amount: number,
  dueDate: Date,
) => `
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Rappel de paiement</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f6f8;font-family:Arial, Helvetica, sans-serif;direction:ltr;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f6f8;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="padding:20px 24px;background:linear-gradient(90deg,#fff 0%, #fff 60%, #f9f9fb 100%);">
              <table width="100%" role="presentation">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="{{COMPANY_LOGO_URL}}" alt="logo" width="120" style="display:block;border:0;"/>
                  </td>
                  <td style="text-align:right;vertical-align:middle;">
                    <div style="font-size:14px;color:#6b7280;">{{COMPANY_NAME}}</div>
                    <div style="font-size:12px;color:#9ca3af;">{{COMPANY_TAGLINE}}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="padding:28px 24px 8px 24px;">
              <h1 style="margin:0;font-size:20px;color:#111827;">Rappel de paiement — Votre facture arrive à échéance</h1>
              <p style="margin:8px 0 0 0;font-size:14px;color:#4b5563;">
                Bonjour ${clientName},<br/>
                Nous vous rappelons que votre facture n° <strong>${numInvoice}</strong> d’un montant de 
                <strong>${amount}</strong> arrive à échéance le <strong>${dueDate}</strong>.
              </p>
            </td>
          </tr>

          <!-- Invoice Summary -->
          <tr>
            <td style="padding:16px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f8;border-radius:10px;padding:12px;">
                <tr>
                  <td style="font-size:13px;color:#374151;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <div>
                        <div style="font-weight:600;">Montant dû</div>
                        <div style="font-size:18px;margin-top:6px;color:#111827;">${amount}</div>
                      </div>
                      <div style="text-align:right;">
                        <div style="font-weight:600;">Date d’échéance</div>
                        <div style="font-size:14px;margin-top:6px;color:#111827;">${dueDate}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:16px 24px;text-align:center;color:#6b7280;font-size:12px;">
              <div>{{COMPANY_NAME}} — {{COMPANY_ADDRESS}}</div>
              <div style="margin-top:8px;">
                Besoin d’aide ? Contactez-nous : <span>contact@support.tn</span> ou 20 329 911
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
