import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Grupo Scout Savio <noreply@scoutsavio.vercel.app>';
const ADMIN_EMAIL = 'scoutsavio331@gmail.com';

// Notificar a admins de nueva subida
export async function notifyAdminsNewUpload(uploaderName, photosCount, category) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: '🆕 Nuevas fotos pendientes de revisión',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e53935;">Nuevas fotos para revisar</h2>
          <p>Hola,</p>
          <p><strong>${uploaderName}</strong> ha subido <strong>${photosCount} foto(s)</strong> a la galería.</p>
          <p><strong>Categoría:</strong> ${category}</p>
          <br/>
          <a href="https://scoutsavio.vercel.app/admin" 
             style="background: linear-gradient(135deg, #e53935, #ff6b35); 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 8px;
                    display: inline-block;">
            Revisar fotos
          </a>
          <br/><br/>
          <p style="color: #666; font-size: 14px;">
            Grupo Scout 331 Savio - Río Tercero, Córdoba
          </p>
        </div>
      `
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
}

// Notificar al usuario que sus fotos fueron aprobadas
export async function notifyUserApproved(userEmail, userName, photosCount) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: '✅ Tus fotos fueron aprobadas',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4caf50;">¡Tus fotos fueron aprobadas!</h2>
          <p>Hola ${userName},</p>
          <p>¡Buenas noticias! Tus <strong>${photosCount} foto(s)</strong> fueron aprobadas y ya están visibles en nuestra galería.</p>
          <br/>
          <a href="https://scoutsavio.vercel.app/galeria" 
             style="background: linear-gradient(135deg, #e53935, #ff6b35); 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 8px;
                    display: inline-block;">
            Ver galería
          </a>
          <br/><br/>
          <p>¡Gracias por compartir estos momentos con nosotros!</p>
          <p style="color: #666; font-size: 14px;">
            Grupo Scout 331 Savio - Río Tercero, Córdoba
          </p>
        </div>
      `
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending approval notification:', error);
    return { success: false, error };
  }
}

// Notificar al usuario que sus fotos fueron rechazadas
export async function notifyUserRejected(userEmail, userName, reason) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: 'ℹ️ Sobre tus fotos enviadas',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff9800;">Sobre tus fotos enviadas</h2>
          <p>Hola ${userName},</p>
          <p>Lamentamos informarte que tus fotos no pudieron ser publicadas por el siguiente motivo:</p>
          <blockquote style="background: #f5f5f5; padding: 16px; border-left: 4px solid #e53935; margin: 16px 0;">
            "${reason}"
          </blockquote>
          <p>Si tenés alguna consulta, no dudes en contactarnos respondiendo a este email.</p>
          <br/>
          <p style="color: #666; font-size: 14px;">
            Grupo Scout 331 Savio - Río Tercero, Córdoba
          </p>
        </div>
      `
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending rejection notification:', error);
    return { success: false, error };
  }
}
