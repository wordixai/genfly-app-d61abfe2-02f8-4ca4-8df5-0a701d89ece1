import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClientStore } from "@/stores/clientStore";
import { Client } from "@/types";
import { Edit, Trash2, Plus, Search, Mail, Phone } from "lucide-react";
import { ClientForm } from "./ClientForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const ClientList = () => {
  const { clients, deleteClient } = useClientStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSegment = segmentFilter === "all" || client.segment === segmentFilter;
    
    return matchesSearch && matchesSegment;
  });

  const getSegmentColor = (segment: Client['segment']) => {
    switch (segment) {
      case 'collector': return 'default';
      case 'gallery': return 'secondary';
      case 'institution': return 'outline';
      case 'casual': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clients</h2>
        <Button onClick={() => {setSelectedClient(null); setShowForm(true);}}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={segmentFilter} onValueChange={setSegmentFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by segment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Segments</SelectItem>
            <SelectItem value="collector">Collector</SelectItem>
            <SelectItem value="gallery">Gallery</SelectItem>
            <SelectItem value="institution">Institution</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <Badge variant={getSegmentColor(client.segment)} className="mt-2">
                    {client.segment}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {setSelectedClient(client); setShowForm(true);}}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteClient(client.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{client.email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
              
              {client.address && (
                <p className="text-sm text-muted-foreground">{client.address}</p>
              )}
              
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Purchases:</span>
                  <span className="font-medium">${client.totalPurchases.toLocaleString()}</span>
                </div>
                {client.preferredMedium && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Preferred Medium:</span>
                    <span className="font-medium">{client.preferredMedium}</span>
                  </div>
                )}
                {client.lastContact && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Contact:</span>
                    <span className="font-medium">{client.lastContact}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Form */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedClient ? 'Edit Client' : 'Add New Client'}
            </DialogTitle>
          </DialogHeader>
          <ClientForm 
            client={selectedClient} 
            onClose={() => setShowForm(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};