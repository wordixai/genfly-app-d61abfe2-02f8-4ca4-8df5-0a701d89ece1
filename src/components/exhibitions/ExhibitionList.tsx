import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExhibitionStore } from "@/stores/exhibitionStore";
import { useArtworkStore } from "@/stores/artworkStore";
import { Exhibition } from "@/types";
import { Edit, Trash2, Plus, Search, Calendar, MapPin } from "lucide-react";
import { ExhibitionForm } from "./ExhibitionForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const ExhibitionList = () => {
  const { exhibitions, deleteExhibition } = useExhibitionStore();
  const { artworks } = useArtworkStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredExhibitions = exhibitions.filter((exhibition) => {
    return exhibition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibition.venue.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: Exhibition['status']) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'active': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getExhibitionArtworks = (artworkIds: string[]) => {
    return artworks.filter(artwork => artworkIds.includes(artwork.id));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Exhibitions</h2>
        <Button onClick={() => {setSelectedExhibition(null); setShowForm(true);}}>
          <Plus className="h-4 w-4 mr-2" />
          Add Exhibition
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exhibitions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Exhibition Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExhibitions.map((exhibition) => {
          const exhibitionArtworks = getExhibitionArtworks(exhibition.artworkIds);
          
          return (
            <Card key={exhibition.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{exhibition.title}</CardTitle>
                    <Badge variant={getStatusColor(exhibition.status)}>
                      {exhibition.status}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {setSelectedExhibition(exhibition); setShowForm(true);}}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteExhibition(exhibition.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{exhibition.venue}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{exhibition.startDate} - {exhibition.endDate}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Artworks ({exhibition.artworkIds.length})
                  </div>
                  
                  {exhibitionArtworks.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {exhibitionArtworks.slice(0, 4).map((artwork) => (
                        <div key={artwork.id} className="aspect-square rounded overflow-hidden bg-gray-100">
                          <img
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {exhibition.artworkIds.length > 4 && (
                    <p className="text-xs text-muted-foreground">
                      +{exhibition.artworkIds.length - 4} more
                    </p>
                  )}
                </div>
                
                {exhibition.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {exhibition.description}
                  </p>
                )}
                
                <div className="pt-2 border-t space-y-1">
                  {exhibition.commission && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Commission:</span>
                      <span className="font-medium">{exhibition.commission}%</span>
                    </div>
                  )}
                  
                  {exhibition.totalSales && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Sales:</span>
                      <span className="font-medium">${exhibition.totalSales.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Form */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedExhibition ? 'Edit Exhibition' : 'Add New Exhibition'}
            </DialogTitle>
          </DialogHeader>
          <ExhibitionForm 
            exhibition={selectedExhibition} 
            onClose={() => setShowForm(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};