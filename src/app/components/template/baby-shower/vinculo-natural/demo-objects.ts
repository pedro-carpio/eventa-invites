import { babyShower } from '../../../../types/event/baby-shower.types';
export function getDemoData() {
  const today = new Date();
  const babyShowerDemoData: babyShower = {
    photoUrl: 'https://placehold.co/600x400',
    title: 'Baby Shower de Belén y su guagüita',
    subtitle: 'Celebrando una llegada muy especial',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 40),
    duration_hours: 3,
    timezone: 'America/"La_Paz"',
    contact: {
      whatsapp_number: 5917123456789,
    },
    guests: ['Juan Pérez', 'María Gómez', 'Ana López'],
    venue: {
      name: 'La Casa de Belén',
      address: 'Calle Falsa 123',
      city: 'La Paz',
      country: 'Bolivia',
      latitude: -16.4958764,
      longitude: -68.1344558,
      instructions: 'Estacionamiento disponible en la entrada principal.',
    },
    instagram_tag: 'BabyShower2025',
    notes: {
      enabled: true,
      title: 'Notas importantes',
      content: [
        { icon: 'info', text: 'Por favor, confirma tu asistencia 10 dias antes del evento' },
        { icon: 'cake', text: 'Habrá pastel y bebidas sin alcohol' },
        { icon: 'car_crash', text: 'El estacionamiento será en la entrada principal.' },
      ],
    },
    food_details: {
      enabled: true,
      title: 'Detalles de la comida',
      content: 'Habrá opciones veganas',
    },
    location_details: {
      enabled: true,
      title: 'Detalles de la ubicación',
      content: 'El trufi XYZ tiene una parada cerca del lugar del evento.',
    },
    rsvp: {
      enabled: true,
      deadline: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 35),
      contact_whatsapp: 5917123456789,
      max_plus_ones: 1,
      fields: [
        { name: 'Juan Pérez', attending: true },
        {
          name: 'María Gómez',
          attending: false,
          notes: 'No podré asistir, pero te deseo lo mejor.',
        },
        {
          name: 'Ana López',
          phone: '+5917012345678',
          attending: true,
          notes: 'Llevaré a Carlos también.',
        },
        { name: 'Carlos Fernández', attending: true },
      ],
    },
    gift: {
      enabled: true,
      enabled_collective_gift: true,
      ideas: [
        {
          img_url: 'https://placehold.co/150',
          title: 'Pañales tamaño M',
          link: 'https://www.example.com/diapers',
        },
        {
          img_url: 'https://placehold.co/150',
          title: 'Ropita para bebé',
          link: 'https://www.example.com/baby-clothes',
        },
        {
          img_url: 'https://placehold.co/150',
          title: 'Juguetes educativos',
          link: 'https://www.example.com/educational-toys',
        },
      ],
      payment_QR_code_url: 'https://placehold.co/150',
      payment_QR_code_instructions:
        'Escanea el código QR para contribuir con un regalo o aportación.',
      gift_list_url:
        'https://www.casaideas.com.bo/customer/event/event-details/baby-shower-de-belen-y-su-guaguita-263',
      instructions: 'Puedes traer un regalo hecho a mano, Lo amaremos aún más.',
    },
    dress_code: {
      enabled: true,
      description: 'Puedes venir como quieras ❤️',
    },
    design: {
      template_id: 'vinculo-natural',
      gallery_images: [
        { src: 'https://placehold.co/600x400', alt: 'Imagen muy especial 1' },
        { src: 'https://placehold.co/600x400', alt: 'Imagen muy especial 2' },
        { src: 'https://placehold.co/600x400', alt: 'Imagen muy especial 3' },
      ],
      sharing: {
        meta: {
          title: 'Únete a este Baby Shower!',
          description: 'Estamos emocionados de celebrar la llegada de alguien contigo. ¡No faltes!',
          image_url: 'https://placehold.co/600x400',
        },
        template:
          '¡Hola! Te invitamos a este Baby Shower. Será una celebración especial para dar la bienvenida a alguien muy especial. ¡Esperamos verte allí!',
      },
    },
  };

  return babyShowerDemoData;
}
