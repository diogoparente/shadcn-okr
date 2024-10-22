"use client";

import { Company } from '../models/Company';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{company.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{company.description}</p>
        <p>Users: {company.users.length}</p>
        <p>OKRs: {company.okrs.length}</p>
      </CardContent>
    </Card>
  );
}