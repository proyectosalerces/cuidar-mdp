/**
 * Service layer for newsletter subscriptions
 *
 * Currently logs to console. Will be replaced with Firebase Firestore
 * or a third-party email service (Mailchimp, Resend, etc.).
 */

export interface NewsletterResult {
  success: boolean;
  message: string;
}

/**
 * Subscribe an email address to the newsletter
 *
 * TODO: Save to Firestore 'newsletter' collection or integrate with email service
 */
export async function suscribirNewsletter(
  email: string
): Promise<NewsletterResult> {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: 'Por favor, ingresá un email válido.',
    };
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  console.log('[Newsletter] Nueva suscripción:', {
    email,
    timestamp: new Date().toISOString(),
  });

  // TODO: Save to Firestore
  // await setDoc(doc(db, 'newsletter', email), {
  //   email,
  //   subscribedAt: serverTimestamp(),
  //   activo: true,
  // });

  return {
    success: true,
    message: '¡Gracias por suscribirte! Recibirás nuestras novedades en tu email.',
  };
}
