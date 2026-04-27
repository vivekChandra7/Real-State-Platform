const sendEmail = async (options) => {
  try {
    const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim();

    // Step 1: API Key check karo
    if (!BREVO_API_KEY) {
      throw new Error("Brevo API key is not defined in environment variables");
    }

    // Step 2: Email data banao
    const data = {
      sender: {
        name: "Real Estate Platform",
        email: process.env.EMAIL_USER,
      },
      to: [{ email: options.email }],
      subject: options.subject,
      htmlContent: options.message,
    };

    // Step 3: Brevo API ko request bhejo
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(data),
    });

    // Step 4: Response parse karo
    const result = await response.json();

    // Step 5: Response check karo
    if (response.ok) {
      console.log(" Email sent successfully to:", options.email);
      return result; //  success result return karo
    } else {
      //  result yahan available hai - error details dikhao
      console.error(" Brevo API error:", result);
      throw new Error(result.message || "Could not send email via Brevo");
    }

  } catch (error) {
    
    console.error(" Brevo email error:", error.message);
    throw new Error(error.message || "Could not send email via Brevo");
  }
};

export default sendEmail;