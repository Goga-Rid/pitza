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
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)',
              transition: 'background 0.2s',
              '&:hover': { background: '#f5f5f5' },
            }}
          >
            <SearchIcon />
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
            borderRadius: 2,
            boxShadow: open ? '0 2px 8px 0 rgba(0,0,0,0.06)' : 'none',
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
              background: selectedCategory === category ? '#FF6900' : 'transparent',
              color: selectedCategory === category ? '#fff' : '#222',
              borderRadius: 3,
              fontWeight: 600,
              px: 2.5,
              py: 1,
              textTransform: 'none',
              fontSize: 16,
              boxShadow: 'none',
              '&:hover': {
                background: selectedCategory === category ? '#ff8500' : '#f5f5f5',
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
