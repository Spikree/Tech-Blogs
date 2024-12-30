"use client"

import { useSession } from 'next-auth/react'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  const {data: session} = useSession();
  return (
    <div></div>
  )
}

export default page