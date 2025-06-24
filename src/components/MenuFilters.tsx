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
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 5, gap: 2 }}>
      {/* Поиск */}
      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', minWidth: 48 }}>
        {!open && (
          <IconButton
            onClick={handleOpen}
            sx={{
              width: 55,
              height: 55,
              background: '#F0F0F0',
              transition: 'background 0.2s',
              color: '#222',
              '&:hover': {
                background: '#dc5b05',
                color: '#fff',
                '& .MuiSvgIcon-root': {
                  color: '#fff',
                },
              },
            }}
          >
            <SearchIcon sx={{ color: 'inherit', transition: 'color 0.2s', fontSize: 34 }} />
          </IconButton>
        )}
        <TextField
          inputRef={inputRef}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Поиск по меню..."
          size="small"
          sx={{
            width: open ? 220 : 0,
            minWidth: 0,
            opacity: open ? 1 : 0,
            ml: open ? 0 : '-48px',
            px: 0,
            background: '#fff',
            border: '1px solid #f5f5f5',
            borderRadius: 2,
            boxShadow: 'none',
            transition: 'width 0.3s, opacity 0.2s, box-shadow 0.2s, margin 0.3s',
            pointerEvents: open ? 'auto' : 'none',
            position: 'static',
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'contained' : 'text'}
            onClick={() => setSelectedCategory(category)}
            sx={{
              background: selectedCategory === category ? '#dc5b05' : 'transparent',
              color: selectedCategory === category ? '#fff' : '#222',
              borderRadius: 3,
              fontWeight: 600,
              px: 2.5,
              py: 1,
              textTransform: 'none',
              fontSize: 16,
              boxShadow: 'none',
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
