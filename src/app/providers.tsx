"use client"

import store from '@/store/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Provider } from 'react-redux'

const providers = ({children}:{children:React.ReactNode}) => {
 
  const [queryClient] = useState(() => new QueryClient());


  return (
    <>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
    </>
  )
}

export default providers