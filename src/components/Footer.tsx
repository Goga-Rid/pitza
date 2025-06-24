import { Box, Typography, Link, Container } from '@mui/material';
import logo from '../assets/footer_logo.svg'; // Логотип компании
import logo_vk from '../assets/vk.svg'; // Логотип ВКонтакте
import logo_telegram from '../assets/telegram.svg'; // Логотип Telegram

export const Footer = () => (
  <Box component="footer" sx={{
    background: '#222',
    color: '#bbb',
    py: { xs: 3, md: 5 },
    mt: 8,
    display: 'flex',
    flexDirection: 'column', // Вертикальное расположение основных блоков
    alignItems: 'center', // Выравнивание по центру
  }}>
    <Container maxWidth="lg" sx={{
      display: 'flex',
      flexDirection: 'row', // Горизонтальное расположение логотипа и правой части
      justifyContent: 'space-between', // Разделение логотипа и правой части
      gap: { xs: 2, md: 5 }, // Отступ между логотипом и правой частью
    }}>
      {/* Логотип */}
      <Box sx={{
        width: { xs: 140, sm: 180, md: 200 },
        height: { xs: 40, sm: 50, md: 60 },
        backgroundImage: `url(${logo})`,
        backgroundSize: 'contain',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
        mb: { xs: 2, md: 0 },
      }} />

      {/* Контакты и соцсети */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end', // Выравнивание по правой стороне
        gap: 1,
      }}>
        <Typography variant="body2" color="#bbb" sx={{ mb: 0.5, fontWeight: 500, fontSize: 16 }}>
          +7 (966) 666 66 66
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Ссылка на ВКонтакте */}
          <Link href="#" color="inherit" underline="none" sx={{ fontSize: 28, opacity: 0.85 }}>
            <img src={logo_vk} alt="ВКонтакте" style={{ width: '32px', height: '32px' }} />
          </Link>

          {/* Ссылка на Telegram */}
          <Link href="#" color="inherit" underline="none" sx={{ fontSize: 28, opacity: 0.85 }}>
            <img src={logo_telegram} alt="Telegram" style={{ width: '32px', height: '32px' }} />
          </Link>
        </Box>
      </Box>
    </Container>

    {/* Ссылки */}
    <Container maxWidth="lg" sx={{
    mt: { xs: 1, md: 3 }, // Отступ от верхней части
    display: 'flex',
    flexDirection: 'column', // Вертикальное расположение ссылок
    gap: 1, // Отступ между ссылками
    fontFamily: 'Italiana, sans-serif', // Установите шрифт Italiana (или аналог)
    fontSize: '20px', // Размер текста
    lineHeight: '100%', // Линейное заполнение
    letterSpacing: '0%', // Интервал между буквами
    textDecoration: 'underline', // Подчеркивание
    textDecorationOffset: '0%', // Смещение подчеркивания
    textDecorationThickness: 'auto', // Толщина подчеркивания
    color: '#FFFFFF',
  }}>
    <Link href="#" color="inherit" underline="always" sx={{ opacity: 0.9 }}>
      О компании
    </Link>
    <Link href="#" color="inherit" underline="always" sx={{ opacity: 0.9 }}>
      Акции
    </Link>
    <Link href="#" color="inherit" underline="always" sx={{ opacity: 0.9 }}>
      Доставка и оплата
    </Link>
    <Link href="#" color="inherit" underline="always" sx={{ opacity: 0.9 }}>
      Согласие на обработку
    </Link>
    <Link href="#" color="inherit" underline="always" sx={{ opacity: 0.9 }}>
      Публичная оферта
    </Link>
    <Link href="#" color="inherit" underline="always" sx={{ opacity: 0.9 }}>
      Политика конфиденциальности
    </Link>
    <Link href="#" color="inherit" underline="always" sx={{ opacity: 0.9 }}>
      Контакты
    </Link>
  </Container>

    {/* Копирайт */}
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="caption" color="#888" sx={{ textAlign: 'center', width: '100%', display: 'block', fontSize: 13 }}>
        © 2025 PITZA. Все права защищены.
      </Typography>
    </Container>
  </Box>
);