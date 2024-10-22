"use client";

import { OKR } from '../models/OKR';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface OKRListProps {
  okrs: OKR[];
}

export function OKRList({ okrs }: OKRListProps) {
  return (
    <div className="space-y-4">
      {okrs.map((okr) => (
        <Card key={okr.id}>
          <CardHeader>
            <CardTitle>{okr.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{okr.description}</p>
            <Progress value={okr.progress} className="mt-2" />
            <p className="mt-2">Progress: {okr.progress}%</p>
            <p>Assigned to: {okr.user.name}</p>
            {okr.company && <p>Company: {okr.company.name}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}