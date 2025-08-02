import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useArtworkStore } from "@/stores/artworkStore";
import { Artwork } from "@/types";
import { Edit, Trash2, Eye, Plus, Search } from "lucide-react";
import { ArtworkForm } from "./ArtworkForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const ArtworkGrid = () => {
  const { artworks, deleteArtwork } = useArtworkStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.medium.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || artwork.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Artwork['status']) => {
    switch (status) {
      case 'available': return 'default';
      case 'sold': return 'destructive';
      case 'reserved': return 'secondary';
      case 'exhibition': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Artworks</h2>
        <Button onClick={() => {setSelectedArtwork(null); setShowForm(true);}}>
          <Plus className="h-4 w-4 mr-2" />
          Add Artwork
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search artworks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="exhibition">In Exhibition</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Artwork Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredArtworks.map((artwork) => (
          <Card key={artwork.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-square mb-3 overflow-hidden rounded-md bg-gray-100">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg">{artwork.title}</h3>
                  <Badge variant={getStatusColor(artwork.status)}>
                    {artwork.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">{artwork.medium}</p>
                <p className="text-sm text-muted-foreground">{artwork.dimensions}</p>
                <p className="text-sm text-muted-foreground">{artwork.yearCreated}</p>
                
                <div className="flex items-center gap-1 flex-wrap">
                  {artwork.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <p className="font-semibold text-lg">
                  ${artwork.status === 'sold' && artwork.soldPrice 
                    ? artwork.soldPrice.toLocaleString() 
                    : artwork.price.toLocaleString()}
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex gap-2 p-4 pt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {setSelectedArtwork(artwork); setShowDetails(true);}}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {setSelectedArtwork(artwork); setShowForm(true);}}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => deleteArtwork(artwork.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add/Edit Form */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedArtwork ? 'Edit Artwork' : 'Add New Artwork'}
            </DialogTitle>
          </DialogHeader>
          <ArtworkForm 
            artwork={selectedArtwork} 
            onClose={() => setShowForm(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Details View */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          {selectedArtwork && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedArtwork.title}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={selectedArtwork.imageUrl}
                    alt={selectedArtwork.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Medium</label>
                    <p>{selectedArtwork.medium}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Dimensions</label>
                    <p>{selectedArtwork.dimensions}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Year</label>
                    <p>{selectedArtwork.yearCreated}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Badge variant={getStatusColor(selectedArtwork.status)}>
                      {selectedArtwork.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Price</label>
                    <p>${selectedArtwork.price.toLocaleString()}</p>
                  </div>
                  {selectedArtwork.description && (
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <p className="text-sm">{selectedArtwork.description}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium">Tags</label>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {selectedArtwork.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};