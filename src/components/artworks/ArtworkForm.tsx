import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useArtworkStore } from "@/stores/artworkStore";
import { Artwork } from "@/types";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ArtworkFormProps {
  artwork?: Artwork | null;
  onClose: () => void;
}

export const ArtworkForm = ({ artwork, onClose }: ArtworkFormProps) => {
  const { addArtwork, updateArtwork } = useArtworkStore();
  const [formData, setFormData] = useState({
    title: '',
    medium: '',
    dimensions: '',
    yearCreated: new Date().getFullYear(),
    price: 0,
    status: 'available' as Artwork['status'],
    imageUrl: '',
    description: '',
    tags: [] as string[],
  });
  const [currentTag, setCurrentTag] = useState('');

  useEffect(() => {
    if (artwork) {
      setFormData({
        title: artwork.title,
        medium: artwork.medium,
        dimensions: artwork.dimensions,
        yearCreated: artwork.yearCreated,
        price: artwork.price,
        status: artwork.status,
        imageUrl: artwork.imageUrl,
        description: artwork.description || '',
        tags: artwork.tags,
      });
    }
  }, [artwork]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (artwork) {
      updateArtwork(artwork.id, formData);
    } else {
      addArtwork(formData);
    }
    
    onClose();
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const mediumOptions = [
    'Oil on Canvas',
    'Acrylic on Canvas',
    'Watercolor',
    'Mixed Media',
    'Digital Art',
    'Photography',
    'Sculpture',
    'Charcoal',
    'Pastel',
    'Ink',
  ];

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
          <Label htmlFor="medium">Medium *</Label>
          <Select 
            value={formData.medium} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, medium: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select medium" />
            </SelectTrigger>
            <SelectContent>
              {mediumOptions.map((medium) => (
                <SelectItem key={medium} value={medium}>
                  {medium}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input
            id="dimensions"
            value={formData.dimensions}
            onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
            placeholder="e.g., 24″ x 36″"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year Created</Label>
          <Input
            id="year"
            type="number"
            value={formData.yearCreated}
            onChange={(e) => setFormData(prev => ({ ...prev, yearCreated: parseInt(e.target.value) }))}
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Artwork['status'] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="exhibition">In Exhibition</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
          placeholder="https://..."
        />
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

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" variant="outline" onClick={addTag}>
            Add
          </Button>
        </div>
        <div className="flex gap-1 flex-wrap mt-2">
          {formData.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {artwork ? 'Update' : 'Add'} Artwork
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};