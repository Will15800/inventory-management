'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, IconButton, Modal, TextField, InputAdornment } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import CssBaseline from '@mui/material/CssBaseline'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#00796b',
    },
    secondary: {
      main: '#c2185b',
    },
    background: {
      default: '#804173', // Set the default background color to orange
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

export default function Home() {
  const [inventory, setInventory] = useState([]) //manage list of inventory items
  const [open, setOpen] = useState(false) //manage modal open state
  const [itemName, setItemName] = useState('') //manage item name input
  const [searchQuery, setSearchQuery] = useState(''); //manage search query which is used to filter inventory items

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory')) //get all inventory items
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => { //iterate through each item and add to inventory list
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }
  
  useEffect(() => {
    updateInventory()
  }, [])
  
  const incrementItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    }
    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }
  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      await deleteDoc(docRef)
    }
    await updateInventory()
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) { //if item already exists, increment quantity, else create new item
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      

        <Typography variant={'h2'} color={'#c2c0c0'} textAlign={'center'}>
          Inventory Items
        </Typography>
        <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
        <TextField
          id="search"
          label="Search Items"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: 2, width: '800px' }}
        />
      <Box border={'1px solid #333'}>

      

        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          
          {filteredInventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Stack direction="column" alignItems="center" flex={1}>
                  <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
                    Quantity: {quantity}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => incrementItem(name)}>
                    Add
                  </Button>
                  <Button variant="contained" startIcon={<RemoveIcon />} onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                  <Button variant="contained" startIcon={<DeleteIcon />} onClick={() => deleteItem(name)}>
                    Delete
                  </Button>
                </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
    </ThemeProvider>
  )
}