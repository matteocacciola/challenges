import { createSlice } from '@reduxjs/toolkit'
import immer from "immer";

export const initialState = {
  currentlyEdited: null,
  items: [],
};

export const componentsSlice = createSlice({
  name: 'components',
  initialState,
  reducers: {
    addComponent: (state, action) => {
      const val = immer(action.payload, draft => {
        draft.values = {}
      })
      state.items.push(val)
      state.currentlyEdited = val
    },
    updateComponent: (state, action) => {
      const { id } = action.payload
      const index = state.items.findIndex((item) => item.id === id)
      if (index === -1) return
      state.items[index] = {
        ...state.items[index],
        ...immer(action.payload.data, draft => {
          draft.values = action.payload.data.values
        })
      }
      state.currentlyEdited = null
    },
    removeComponent: (state, action) => {
      const { id } = action.payload
      const index = state.items.findIndex((item) => item.id === id)
      if (index === -1) return
      state.items.splice(index, 1)
      state.currentlyEdited = null
    },
    setEditedComponent: (state, action) => {
      state.currentlyEdited = immer(action.payload.component, () => {})
    },
  },
})

export const componentsActions = componentsSlice.actions
export const componentsReducer = componentsSlice.reducer
