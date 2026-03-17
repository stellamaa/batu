'use client'

import React from 'react';
import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.congif'



export default function AdminPage() {
    return <NextStudio config={config} />;
}