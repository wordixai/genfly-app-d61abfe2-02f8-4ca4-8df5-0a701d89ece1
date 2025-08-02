import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useArtworkStore } from "@/stores/artworkStore";
import { useClientStore } from "@/stores/clientStore";
import { useExhibitionStore } from "@/stores/exhibitionStore";
import { DollarSign, ImageIcon, Users, Calendar } from "lucide-react";

export const Dashboard = () => {
  const { artworks, getAvailableArtworks } = useArtworkStore();
  const { clients } = useClientStore();
  const { exhibitions, getUpcomingExhibitions } = useExhibitionStore();

  const availableArtworks = getAvailableArtworks();
  const soldArtworks = artworks.filter(a => a.status === 'sold');
  const totalRevenue = soldArtworks.reduce((sum, artwork) => sum + (artwork.soldPrice || 0), 0);
  const upcomingExhibitions = getUpcomingExhibitions();

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: `From ${soldArtworks.length} sold pieces`
    },
    {
      title: "Available Artworks",
      value: availableArtworks.length.toString(),
      icon: ImageIcon,
      description: `${artworks.length} total pieces`
    },
    {
      title: "Active Clients",
      value: clients.length.toString(),
      icon: Users,
      description: "Across all segments"
    },
    {
      title: "Upcoming Exhibitions",
      value: upcomingExhibitions.length.toString(),
      icon: Calendar,
      description: "Scheduled events"
    }
  ];

  const recentSales = soldArtworks.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.length > 0 ? (
                recentSales.map((artwork) => (
                  <div key={artwork.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{artwork.title}</p>
                      <p className="text-sm text-muted-foreground">{artwork.soldDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${artwork.soldPrice?.toLocaleString()}</p>
                      <Badge variant="secondary">{artwork.medium}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No sales yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exhibitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingExhibitions.length > 0 ? (
                upcomingExhibitions.map((exhibition) => (
                  <div key={exhibition.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{exhibition.title}</p>
                      <Badge variant={exhibition.status === 'scheduled' ? 'default' : 'secondary'}>
                        {exhibition.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{exhibition.venue}</p>
                    <p className="text-sm text-muted-foreground">
                      {exhibition.startDate} - {exhibition.endDate}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No upcoming exhibitions</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};