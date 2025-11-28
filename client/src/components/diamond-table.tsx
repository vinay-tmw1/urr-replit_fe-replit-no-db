import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash2 } from "lucide-react";

interface Diamond {
  id: string;
  diamondId: string;
  carat: string;
  shape: string;
  color: string;
  clarity: string;
  cut: string;
  certification: string;
  location: string;
  status: string;
  price?: string;
}

interface DiamondTableProps {
  diamonds: Diamond[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export default function DiamondTable({ 
  diamonds, 
  total, 
  page, 
  onPageChange, 
  isLoading 
}: DiamondTableProps) {
  const [selectedDiamonds, setSelectedDiamonds] = useState<string[]>([]);
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  const startItem = page * itemsPerPage + 1;
  const endItem = Math.min((page + 1) * itemsPerPage, total);

  const statusColors = {
    available: 'default',
    reserved: 'destructive',
    in_production: 'secondary',
    sold: 'outline',
    grading: 'outline',
  } as const;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDiamonds(diamonds.map(d => d.id));
    } else {
      setSelectedDiamonds([]);
    }
  };

  const handleSelectDiamond = (diamondId: string, checked: boolean) => {
    if (checked) {
      setSelectedDiamonds(prev => [...prev, diamondId]);
    } else {
      setSelectedDiamonds(prev => prev.filter(id => id !== diamondId));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (diamonds.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No diamonds found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or add new diamonds to the inventory.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="diamond-table">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedDiamonds.length === diamonds.length}
                  onCheckedChange={handleSelectAll}
                  data-testid="checkbox-select-all"
                />
              </TableHead>
              <TableHead>Diamond ID</TableHead>
              <TableHead>Carat</TableHead>
              <TableHead>Shape</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Clarity</TableHead>
              <TableHead>Cut</TableHead>
              <TableHead>Certification</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diamonds.map((diamond) => (
              <TableRow key={diamond.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={selectedDiamonds.includes(diamond.id)}
                    onCheckedChange={(checked) => handleSelectDiamond(diamond.id, checked as boolean)}
                    data-testid={`checkbox-diamond-${diamond.id}`}
                  />
                </TableCell>
                <TableCell className="font-medium" data-testid={`text-diamond-id-${diamond.id}`}>
                  {diamond.diamondId}
                </TableCell>
                <TableCell data-testid={`text-carat-${diamond.id}`}>
                  {diamond.carat}
                </TableCell>
                <TableCell className="capitalize" data-testid={`text-shape-${diamond.id}`}>
                  {diamond.shape}
                </TableCell>
                <TableCell data-testid={`text-color-${diamond.id}`}>
                  {diamond.color}
                </TableCell>
                <TableCell data-testid={`text-clarity-${diamond.id}`}>
                  {diamond.clarity}
                </TableCell>
                <TableCell className="capitalize" data-testid={`text-cut-${diamond.id}`}>
                  {diamond.cut?.replace('_', ' ')}
                </TableCell>
                <TableCell className="uppercase" data-testid={`text-certification-${diamond.id}`}>
                  {diamond.certification}
                </TableCell>
                <TableCell className="capitalize" data-testid={`text-location-${diamond.id}`}>
                  {diamond.location?.replace('_', ' ')}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={statusColors[diamond.status as keyof typeof statusColors] || 'outline'}
                    className="capitalize"
                    data-testid={`badge-status-${diamond.id}`}
                  >
                    {diamond.status?.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      data-testid={`button-view-${diamond.id}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      data-testid={`button-edit-${diamond.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      data-testid={`button-delete-${diamond.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground" data-testid="pagination-info">
          Showing {startItem} to {endItem} of {total} diamonds
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            data-testid="button-previous-page"
          >
            Previous
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = page < 3 ? i : page - 2 + i;
            if (pageNum >= totalPages) return null;
            
            return (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                data-testid={`button-page-${pageNum + 1}`}
              >
                {pageNum + 1}
              </Button>
            );
          })}
          {totalPages > 5 && page < totalPages - 3 && (
            <>
              <span className="text-sm text-muted-foreground">...</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages - 1)}
                data-testid={`button-page-${totalPages}`}
              >
                {totalPages}
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            data-testid="button-next-page"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
