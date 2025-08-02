import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClientStore } from "@/stores/clientStore";
import { Client } from "@/types";

interface ClientFormProps {
  client?: Client | null;
  onClose: () => void;
}

export const ClientForm = ({ client, onClose }: ClientFormProps) => {
  const { addClient, updateClient } = useClientStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    segment: 'casual' as Client['segment'],
    notes: '',
    preferredMedium: '',
    lastContact: '',
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address || '',
        segment: client.segment,
        notes: client.notes || '',
        preferredMedium: client.preferredMedium || '',
        lastContact: client.lastContact || '',
      });
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (client) {
      updateClient(client.id, formData);
    } else {
      addClient(formData);
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="segment">Segment *</Label>
          <Select 
            value={formData.segment} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, segment: value as Client['segment'] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="collector">Collector</SelectItem>
              <SelectItem value="gallery">Gallery</SelectItem>
              <SelectItem value="institution">Institution</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredMedium">Preferred Medium</Label>
          <Input
            id="preferredMedium"
            value={formData.preferredMedium}
            onChange={(e) => setFormData(prev => ({ ...prev, preferredMedium: e.target.value }))}
            placeholder="e.g., Oil, Acrylic, Photography"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastContact">Last Contact</Label>
          <Input
            id="lastContact"
            type="date"
            value={formData.lastContact}
            onChange={(e) => setFormData(prev => ({ ...prev, lastContact: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          placeholder="Full address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          placeholder="Additional notes about the client..."
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {client ? 'Update' : 'Add'} Client
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};