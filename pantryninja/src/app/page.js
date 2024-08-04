'use client';

import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Box, Typography, Stack, TextField, IconButton, List, ListItem, ListItemText, ButtonGroup, Button, CircularProgress, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { db } from './firebase'; // Adjust import according to your setup
import { generateRecipes } from './actions'; // Adjust import according to your setup
import { InputAdornment } from '@mui/material'; // Add this import statement
import SearchIcon from '@mui/icons-material/Search'; // Add this import statement


export default function Home() {
  // Inventory management state
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Recipe generation state
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.trim() !== '') {
      await addDoc(collection(db, 'items'), {
        name: newItem.trim(),
        quantity: 1,
        expiryDate: expiryDate || null, // Add expiryDate to the item
      });
      setNewItem('');
      setExpiryDate('');
    }
  };

  // Read items
  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  // Delete item
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  // Increase quantity
  const increaseQuantity = async (id, currentQuantity) => {
    const itemRef = doc(db, 'items', id);
    await updateDoc(itemRef, {
      quantity: currentQuantity + 1,
    });
  };

  // Decrease quantity
  const decreaseQuantity = async (id, currentQuantity) => {
    if (currentQuantity > 1) {
      const itemRef = doc(db, 'items', id);
      await updateDoc(itemRef, {
        quantity: currentQuantity - 1,
      });
    }
  };

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle recipe generation
  const handleRecipeGeneration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { recipes: result } = await generateRecipes(input);
    setIsLoading(false);
    setRecipes(result.recipes);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={4}
      sx={{ backgroundColor: '#3e2555', height: '100vh' }}
    >
      {/* Header */}
      <Box
        width="100%"
        p={2}
        mb={4}
        borderRadius="16px"
        boxShadow="0 8px 16px rgba(0, 0, 0, 0.1)"
        sx={{
          background: '#301934',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h1" fontWeight="bold" fontSize="2.5rem">
          StashPal
        </Typography>
        {/* You can add icons or other elements here if needed */}
      </Box>

      {/* Main Content */}
      <Box
        width="100%"
        maxWidth="1200px"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {/* Inventory Management */}
        <Box
          width="100%"
          p={4}
          mb={4}
          borderRadius="16px"
          boxShadow="0 8px 16px rgba(0, 0, 0, 0.1)"
          sx={{
            background: 'linear-gradient(45deg,	#663196,	#a58eb9)',
            color: 'white',
            maxHeight: '500px',
            overflowY: 'auto',
            scrollbarWidth: 'thin', // For Firefox
            '&::-webkit-scrollbar': {
              width: '8px', // For Chrome, Safari, and Edge
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#301934',
              borderRadius: '8px',
            },
          }}
        >
          <Typography variant="h2" component="h1" fontWeight="bold" fontSize="2rem" textAlign="center" mb={2}>
            Your Stash
          </Typography>
          <Stack spacing={2} mb={2}>
            <form onSubmit={addItem} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <TextField
                label="Enter Item"
                variant="outlined"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                fullWidth
                InputProps={{ style: { borderRadius: 8, fontSize: '1.1rem' } }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Enter Expiry Date"
                variant="outlined"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                InputProps={{ style: { borderRadius: 8, fontSize: '1.1rem' } }}
                InputLabelProps={{ shrink: true }}
                sx={{ width: '180px' }}
              />
              <IconButton
                onClick={addItem}
                color="primary"
                sx={{ bgcolor: '#301934', '&:hover': { bgcolor: '#452d62' }, color: 'white' }}
              >
                <AddIcon />
              </IconButton>
            </form>
            <TextField
              label="Search Items"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              InputProps={{
                style: { borderRadius: 8, fontSize: '1.1rem' },
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
          <List>
            {filteredItems.map((item) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(item.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{ bgcolor: '#301934', color: 'white', borderRadius: '8px', marginBottom: '10px' }}
              >
                <ListItemText primary={item.name} />
                <ButtonGroup variant="contained" sx={{ bgcolor: '#301934', borderRadius: '8px' }}>
                  <Button
                    onClick={() => decreaseQuantity(item.id, item.quantity)}
                    sx={{ color: 'white', minWidth: '40px', '&:hover': { bgcolor: '#452d62' } }}
                  >
                    <RemoveIcon />
                  </Button>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      bgcolor: 'white',
                      color: '#301934',
                      borderRadius: '0px',
                    }}
                  >
                    {item.quantity}
                  </Box>
                  <Button
                    onClick={() => increaseQuantity(item.id, item.quantity)}
                    sx={{ color: 'white', minWidth: '40px', '&:hover': { bgcolor: '#452d62' } }}
                  >
                    <AddIcon />
                  </Button>
                </ButtonGroup>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Recipe Generation */}
        <Box
          width="100%"
          p={4}
          borderRadius="16px"
          boxShadow="0 8px 16px rgba(0, 0, 0, 0.1)"
          sx={{
            background: 'linear-gradient(45deg,#663196,	#a58eb9)',
            color: 'white',
            maxHeight: '500px',
            overflowY: 'auto',
            scrollbarWidth: 'thin', // For Firefox
            '&::-webkit-scrollbar': {
              width: '8px', // For Chrome, Safari, and Edge
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#301934',
              borderRadius: '8px',
            },
          }}
        >
          <Typography variant="h2" component="h1" fontWeight="bold" fontSize="2rem" textAlign="center" mb={2}>
            Recipe Suggestions
          </Typography>
          <form onSubmit={handleRecipeGeneration} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <TextField
              label="Enter Ingredients"
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              fullWidth
              InputProps={{ style: { borderRadius: 8, fontSize: '1.1rem' } }}
              InputLabelProps={{ shrink: true }}
            />
            <IconButton
              type="submit"
              color="primary"
              sx={{ bgcolor: '#301934', '&:hover': { bgcolor: '#452d62' }, color: 'white' }}
            >
              <AddIcon />
            </IconButton>
          </form>
          {isLoading ? (
            <CircularProgress sx={{ marginTop: 2, color: '#301934' }} />
          ) : (
            <Stack spacing={2} mt={2}>
              {recipes.map((recipe, index) => (
                <Box
                  key={index}
                  p={2}
                  borderRadius="8px"
                  sx={{ background: '#fff', color: '#301934', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                >
                  <Typography variant="h6" component="h2" fontWeight="bold">
                    {recipe.title}
                  </Typography>
                  <Typography variant="body2">{recipe.description}</Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}


