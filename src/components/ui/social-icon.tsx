import { ArrowRight } from 'lucide-react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
  FaTelegram,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaMapPin,
} from 'react-icons/fa6';

export default function SocialIcon({
  label,
  color,
}: {
  label: string;
  color?: string;
}) {
  // Helper for social icons
  function getSocialIcon(label: string) {
    switch (label.toLowerCase()) {
      case 'facebook':
        return <FaFacebookF className={`h-4 w-4 ${color}`} />;
      case 'twitter':
      case 'x':
        return <FaXTwitter className={`h-4 w-4 ${color}`} />;
      case 'linkedin':
        return <FaLinkedinIn className={`h-4 w-4 ${color}`} />;
      case 'instagram':
        return <FaInstagram className={`h-4 w-4 ${color}`} />;
      case 'youtube':
        return <FaYoutube className={`h-4 w-4 ${color}`} />;
      case 'telegram':
        return <FaTelegram className={`h-4 w-4 ${color}`} />;
      case 'email':
        return <FaEnvelope className={`h-4 w-4 ${color}`} />;
      case 'phone':
        return <FaPhone className={`h-4 w-4 ${color}`} />;
      case 'address':
        return <FaMapPin className={`h-4 w-4 ${color}`} />;
      case 'whatsapp':
        return (
          <FaWhatsapp className={`h-4 w-4 ${color ? `text-${color}` : ''}`} />
        );
      default:
        return (
          <ArrowRight className={`h-4 w-4 ${color ? `text-${color}` : ''}`} />
        );
    }
  }
  return getSocialIcon(label);
}