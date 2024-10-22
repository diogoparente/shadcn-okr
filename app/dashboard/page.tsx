"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account, databases } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [newObjective, setNewObjective] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.get();
        setUser(session);
        fetchObjectives();
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const fetchObjectives = async () => {
    try {
      const response = await databases.listDocuments(
        'YOUR_DATABASE_ID',
        'YOUR_COLLECTION_ID'
      );
      setObjectives(response.documents);
    } catch (error) {
      toast({
        title: "Error fetching objectives",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addObjective = async () => {
    if (!newObjective.trim()) return;
    try {
      await databases.createDocument(
        'YOUR_DATABASE_ID',
        'YOUR_COLLECTION_ID',
        'unique()',
        { title: newObjective, userId: user.$id }
      );
      setNewObjective('');
      fetchObjectives();
      toast({
        title: "Objective added",
        description: "Your new objective has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error adding objective",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteObjective = async (id) => {
    try {
      await databases.deleteDocument('YOUR_DATABASE_ID', 'YOUR_COLLECTION_ID', id);
      fetchObjectives();
      toast({
        title: "Objective deleted",
        description: "The objective has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error deleting objective",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      router.push('/');
    } catch (error) {
      toast({
        title: "Error logging out",
        description: error.message,
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <div className="mb-8">
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
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {objectives.map((objective) => (
          <Card key={objective.$id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {objective.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteObjective(objective.$id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {/* Add key results here */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}