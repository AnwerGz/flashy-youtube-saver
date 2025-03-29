
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Github } from 'lucide-react';

interface Developer {
  name: string;
  photo: string;
  githubUrl: string;
}

interface DeveloperCardProps {
  developer: Developer;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer }) => {
  return (
    <Card className="min-w-[250px] border-flash-200 hover:shadow-md transition-all hover:border-flash-400 h-full">
      <CardContent className="p-4 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-flash-400">
          <img 
            src={developer.photo} 
            alt={developer.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback image if loading fails
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/100?text=Dev";
            }}
          />
        </div>
        <h3 className="font-bold text-lg mb-1">{developer.name}</h3>
        <a 
          href={developer.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-flash-600 hover:text-flash-800 transition-colors"
        >
          <Github className="h-4 w-4" />
          <span>GitHub Profile</span>
        </a>
      </CardContent>
    </Card>
  );
};

export default DeveloperCard;
