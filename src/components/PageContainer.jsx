import React from 'react'
import { Nav } from './Nav';
import { Footer } from './Footer';

export const PageContainer = ({children}) => {
  return (
    <>
    <Nav/>
    {children}
    <Footer/>
    </>
  )
}
