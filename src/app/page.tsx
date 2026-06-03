"use client";

import { useState } from 'react';
import { ProposalLanding } from '@/components/ProposalLanding';
import { RoadtripApp } from '@/components/RoadtripApp';

export default function Home() {
  const [isAccepted, setIsAccepted] = useState(false);

  return (
    <>
      {!isAccepted ? (
        <ProposalLanding onAccept={() => setIsAccepted(true)} />
      ) : (
        <RoadtripApp />
      )}
    </>
  );
}
