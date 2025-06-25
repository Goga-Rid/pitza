import { useRef, useState } from 'react';
import { Box, IconButton, TextField, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const categories = ['Все', 'pizza', 'combo', 'dessert', 'drink', 'snack'];

const categoryNames: { [key: string]: string } = {
  'Все': 'Все',
  'pizza': 'Пиццы',
  'combo': 'Комбо',
  'dessert': 'Десерты',
  'drink': 'Напитки',
  'snack': 'Закуски'
};

interface MenuFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
}

export const MenuFilters = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }: MenuFiltersProps) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'stretch', sm: 'center' },
      justifyContent: { xs: 'center', sm: 'flex-start' },
      mb: { xs: 2, sm: 5 },
      gap: { xs: 1.5, sm: 2 },
      flexWrap: 'wrap',
    }}>
      {/* Поиск */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        minWidth: open ? { xs: '220px', sm: 160 } : { xs: 48, sm: 48 },
        width: open ? { xs: '100%', sm: 220 } : { xs: 48, sm: 55 },
        order: { xs: 1, sm: 0 },
        transition: 'min-width 0.3s, width 0.3s',
      }}>
        {!open && (
          <IconButton
            onClick={handleOpen}
            sx={{
              width: { xs: 48, sm: 55 },
              height: { xs: 48, sm: 55 },
              background: '#F0F0F0',
              transition: 'background 0.2s',
              color: '#222',
              '&:hover': {
                background: '#dc5b05',
                color: '#fff',
              },
            }}
          >
            <SearchIcon sx={{ color: 'inherit', fontSize: { xs: 28, sm: 34 } }} />
          </IconButton>
        )}
        <TextField
          inputRef={inputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск по меню..."
          size="small"
          sx={{
            width: open ? '100%' : 0,
            minWidth: 0,
            opacity: open ? 1 : 0,
            ml: open ? 0 : '-48px',
            px: 0,
            background: '#fff',
            border: '1px solid #f5f5f5',
            borderRadius: 2,
            boxShadow: 'none',
            transition: 'width 0.3s, opacity 0.2s, margin 0.3s',
            pointerEvents: open ? 'auto' : 'none',
            position: 'static',
            '.MuiInputBase-root': {
              height: { xs: 40, sm: 48 },
              fontSize: { xs: 14, sm: 16 },
            },
          }}
          InputProps={{
            endAdornment: open ? (
              <InputAdornment position="end">
                <IconButton onClick={handleClose} size="small">
                  ✕
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
      </Box>

      {/* Категории */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          overflowX: { xs: 'visible', sm: 'visible' },
          gap: 1,
          py: { xs: 0.5, sm: 0 },
          flexGrow: 1,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          mx: { xs: 0, sm: 0 },
          px: { xs: 0, sm: 0 },
          order: { xs: 2, sm: 1 },
        }}
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'contained' : 'text'}
            onClick={() => setSelectedCategory(category)}
            sx={{
              whiteSpace: 'nowrap',
              background: selectedCategory === category ? '#dc5b05' : 'transparent',
              color: selectedCategory === category ? '#fff' : '#222',
              borderRadius: 3,
              fontWeight: 600,
              px: { xs: 1.5, sm: 2.5 },
              py: { xs: 0.5, sm: 1 },
              textTransform: 'none',
              fontSize: { xs: 14, sm: 16 },
              boxShadow: 'none',
              minWidth: 'auto',
              '&:hover': {
                background: selectedCategory === category ? '#FF6900' : '#f5cba7',
                color: selectedCategory === category ? '#fff' : '#222',
              },
            }}
          >
            {categoryNames[category]}
          </Button>
        ))}
      </Box>
    </Box>
  );
};