import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useExhibitionStore } from "@/stores/exhibitionStore";
import { useArtworkStore } from "@/stores/artworkStore";
import { Exhibition } from "@/types";

interface ExhibitionFormProps {
  exhibition?: Exhibition | null;
  onClose: () => void;
}

export const ExhibitionForm = ({ exhibition, onClose }: ExhibitionFormProps) => {
  const { addExhibition, updateExhibition } = useExhibitionStore();
  const { artworks } = useArtworkStore();
  
  const [formData, setFormData] = useState({
    title: '',
    venue: '',
    startDate: '',
    endDate: '',
    status: 'scheduled' as Exhibition['status'],
    artworkIds: [] as string[],
    description: '',
    commission: 0,
    totalSales: 0,
  });

  useEffect(() => {
    if (exhibition) {
      setFormData({
        title: exhibition.title,
        venue: exhibition.venue,
        startDate: exhibition.startDate,
        endDate: exhibition.endDate,
        status: exhibition.status,
        artworkIds: exhibition.artworkIds,
        description: exhibition.description || '',
        commission: exhibition.commission || 0,
        totalSales: exhibition.totalSales || 0,
      });
    }
  }, [exhibition]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (exhibition) {
      updateExhibition(exhibition.id, formData);
    } else {
      addExhibition(formData);
    }
    
    onClose();
  };

  const handleArtworkToggle = (artworkId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      artworkIds: checked 
        ? [...prev.artworkIds, artworkId]
        : prev.artworkIds.filter(id => id !== artworkId)
    }));
  };

  const availableArtworks = artworks.filter(artwork => 
    artwork.status === 'available' || formData.artworkIds.includes(artwork.id)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue">Venue *</Label>
          <Input
            id="venue"
            value={formData.venue}
            onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Exhibition['status'] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="commission">Commission (%)</Label>
          <Input
            id="commission"
            type="number"
            value={formData.commission}
            onChange={(e) => setFormData(prev => ({ ...prev, commission: parseFloat(e.target.value) || 0 }))}
            min="0"
            max="100"
            step="0.1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      {formData.status === 'completed' && (
        <div className="space-y-2">
          <Label htmlFor="totalSales">Total Sales ($)</Label>
          <Input
            id="totalSales"
            type="number"
            value={formData.totalSales}
            onChange={(e) => setFormData(prev => ({ ...prev, totalSales: parseFloat(e.target.value) || 0 }))}
            min="0"
            step="0.01"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Select Artworks</Label>
        <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
          {availableArtworks.length > 0 ? (
            <div className="space-y-3">
              {availableArtworks.map((artwork) => (
                <div key={artwork.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={artwork.id}
                    checked={formData.artworkIds.includes(artwork.id)}
                    onCheckedChange={(checked) => handleArtworkToggle(artwork.id, !!checked)}
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{artwork.title}</p>
                      <p className="text-sm text-muted-foreground">{artwork.medium}</p>
                      <p className="text-sm text-muted-foreground">${artwork.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No available artworks</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {exhibition ? 'Update' : 'Add'} Exhibition
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};