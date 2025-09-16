import React, { useState, useEffect } from 'react';
import { healthCheck } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BackendStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const status = await healthCheck();
      setIsConnected(status);
      setLastChecked(new Date());
    } catch (error) {
      setIsConnected(false);
      setLastChecked(new Date());
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isConnected === null) return 'bg-gray-100 text-gray-800';
    if (isConnected) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusIcon = () => {
    if (isConnected === null) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (isConnected) return <Wifi className="h-4 w-4" />;
    return <WifiOff className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (isConnected === null) return 'Checking...';
    if (isConnected) return 'Connected';
    return 'Disconnected';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          Backend Status
          <Badge variant="outline" className={getStatusColor()}>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              {getStatusText()}
            </div>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          <p>Backend: <code className="bg-gray-100 px-1 rounded">localhost:8080</code></p>
          <p>Frontend: <code className="bg-gray-100 px-1 rounded">localhost:3000</code></p>
        </div>
        
        {lastChecked && (
          <p className="text-xs text-muted-foreground">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        )}
        
        <Button 
          onClick={checkConnection} 
          disabled={isChecking}
          variant="outline" 
          size="sm"
          className="w-full"
        >
          {isChecking ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Checking...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Check Connection
            </div>
          )}
        </Button>
        
        {isConnected === false && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Connection Failed!</strong> Make sure your backend is running on port 8080.
            </p>
            <div className="mt-2 text-xs text-red-600">
              <p>• Check if backend server is started</p>
              <p>• Verify port 8080 is not blocked</p>
              <p>• Check backend console for errors</p>
            </div>
          </div>
        )}
        
        {isConnected === true && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>All Systems Operational!</strong> Your frontend is successfully connected to the backend.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BackendStatus;
