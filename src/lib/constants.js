export const WHATSAPP_NUMBER = "553137726397";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const EMAIL = "giftexcellence.03@gmail.com";
export const PHONE = "+55 31 3772-6397";
export const INSTAGRAM = "https://www.instagram.com/giftexcellence_ofc/";
export const ADDRESS = "Belo Horizonte, MG - Brasil";
export const HOURS = "Segunda a Sexta: 08h às 18h | Sábado: 08h às 12h";
export const GOOGLE_BUSINESS = "https://www.google.com/search?q=Gift+Excellence+Belo+Horizonte+avalia%C3%A7%C3%B5es";

export const getWhatsAppLink = (message = "") => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
};