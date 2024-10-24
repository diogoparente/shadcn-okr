"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account, databases } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { OKRList } from "@/components/OKRList";
import { Company } from "@/models/Company";
import { OKR } from "@/models/OKR";
import { CompanyCard } from "@/components/CompanyCard";
import { AppwriteException, Models } from "appwrite";

// Mock data for demonstration
const mockCompany: Company = {
  id: "1",
  name: "Acme Inc.",
  description: "A leading technology company",
  users: [],
  okrs: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockOKRs: OKR[] = [
  {
    id: "1",
    title: "Increase Revenue",
    description: "Boost company revenue by 20%",
    progress: 75,
    userId: "1",
    user: {
      $id: "1",
      name: "John Doe",
      email: "john@acme.com",
      company: mockCompany,
      companyId: "1",
    },
    companyId: "1",
    company: mockCompany,
    children: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<Models.User<Models.Preferences>>();
  const [objectives, setObjectives] = useState<Models.Document[]>([]);
  const [newObjective, setNewObjective] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.get();
        setUser(session);
        fetchObjectives();
      } catch (error) {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const fetchObjectives = async () => {
    try {
      const response = await databases.listDocuments(
        "YOUR_DATABASE_ID",
        "YOUR_COLLECTION_ID"
      );
      setObjectives(response.documents);
    } catch (error) {
      toast({
        title: "Error fetching objectives",
        description: (error as AppwriteException).message,
        variant: "destructive",
      });
    }
  };

  const addObjective = async () => {
    if (!newObjective.trim()) return;
    try {
      await databases.createDocument(
        "YOUR_DATABASE_ID",
        "YOUR_COLLECTION_ID",
        "unique()",
        { title: newObjective, userId: user?.$id }
      );
      setNewObjective("");
      fetchObjectives();
      toast({
        title: "Objective added",
        description: "Your new objective has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error adding objective",
        description: (error as AppwriteException).message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      router.push("/");
    } catch (error) {
      toast({
        title: "Error logging out",
        description: (error as AppwriteException).message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-8">Company OKR Dashboard</h1>
        <CompanyCard company={mockCompany} />

        <div className="py-8">
          <h2 className="text-2xl font-semibold mb-4">Add New Objective</h2>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              placeholder="Enter your objective"
              className="flex-grow"
            />
            <Button onClick={addObjective}>
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Company OKRs</h2>
            <OKRList okrs={mockOKRs} />
          </div>
        </div>
      </div>
    </div>
  );
}
