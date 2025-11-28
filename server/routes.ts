import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import { z } from "zod";

// Simple session setup without database
function getSession() {
  return session({
    secret: process.env.SESSION_SECRET || 'development-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    },
  });
}

// Simple auth middleware for development
const isAuthenticated = (req: any, res: any, next: any) => {
  // For Ubuntu deployment without complex auth, we'll mock the user
  req.user = {
    claims: {
      sub: "46981679",
      email: "demo@example.com",
      first_name: "Demo",
      last_name: "User"
    }
  };
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(getSession());

  // Mock auth routes for development
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let user = await storage.getUser(userId);
      
      // Create user if not exists
      if (!user) {
        user = await storage.upsertUser({
          id: userId,
          email: req.user.claims.email,
          firstName: req.user.claims.first_name,
          lastName: req.user.claims.last_name,
          profileImageUrl: null
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Mock login/logout routes
  app.get('/api/login', (req, res) => {
    res.redirect('/');
  });

  app.get('/api/logout', (req, res) => {
    res.redirect('/');
  });

  // Dashboard metrics
  app.get('/api/dashboard/metrics', isAuthenticated, async (req, res) => {
    try {
      const metrics = {
        polishedInventory: 102847,
        monthlyYield: 45234,
        rdProjects: 28,
        growingInventory: 45234,
        totalEmployees: 2347,
        globalLocations: 6,
        monthlyRevenue: 127500000,
        industrialApplications: 7
      };
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Diamond inventory routes
  app.get('/api/diamonds', isAuthenticated, async (req, res) => {
    try {
      const {
        limit = '10',
        offset = '0',
        location,
        status,
        search
      } = req.query;

      const result = await storage.getDiamonds({
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        location: location as string,
        status: status as string,
        search: search as string
      });

      res.json(result);
    } catch (error) {
      console.error("Error fetching diamonds:", error);
      res.status(500).json({ message: "Failed to fetch diamonds" });
    }
  });

  app.get('/api/diamonds/:id', isAuthenticated, async (req, res) => {
    try {
      const diamond = await storage.getDiamond(req.params.id);
      if (!diamond) {
        return res.status(404).json({ message: "Diamond not found" });
      }
      res.json(diamond);
    } catch (error) {
      console.error("Error fetching diamond:", error);
      res.status(500).json({ message: "Failed to fetch diamond" });
    }
  });

  // Manufacturing routes
  app.get('/api/rough-diamonds', isAuthenticated, async (req, res) => {
    try {
      const {
        limit = '50',
        offset = '0',
        status,
        location
      } = req.query;

      const result = await storage.getRoughDiamonds({
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        status: status as string,
        location: location as string
      });

      res.json(result);
    } catch (error) {
      console.error("Error fetching rough diamonds:", error);
      res.status(500).json({ message: "Failed to fetch rough diamonds" });
    }
  });

  app.get('/api/cutting-plans', isAuthenticated, async (req, res) => {
    try {
      // Return empty plans initially for the demo
      const plans: any[] = [];
      res.json({ plans });
    } catch (error) {
      console.error("Error fetching cutting plans:", error);
      res.status(500).json({ message: "Failed to fetch cutting plans" });
    }
  });

  // R&D routes
  app.get('/api/rd-projects', isAuthenticated, async (req, res) => {
    try {
      const {
        limit = '10',
        offset = '0',
        status,
        category
      } = req.query;

      const result = await storage.getRdProjects({
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        status: status as string,
        category: category as string
      });

      res.json(result);
    } catch (error) {
      console.error("Error fetching R&D projects:", error);
      res.status(500).json({ message: "Failed to fetch R&D projects" });
    }
  });

  // Growing equipment routes
  app.get('/api/growing-equipment', isAuthenticated, async (req, res) => {
    try {
      const { location } = req.query;
      const equipment = await storage.getGrowingEquipment(location as string);
      res.json(equipment);
    } catch (error) {
      console.error("Error fetching growing equipment:", error);
      res.status(500).json({ message: "Failed to fetch growing equipment" });
    }
  });

  // Industrial routes
  app.get('/api/industrial-allocations', isAuthenticated, async (req, res) => {
    try {
      const allocations = await storage.getIndustrialAllocations();
      res.json(allocations);
    } catch (error) {
      console.error("Error fetching industrial allocations:", error);
      res.status(500).json({ message: "Failed to fetch industrial allocations" });
    }
  });

  // Collaboration routes
  app.get('/api/collaborations', isAuthenticated, async (req, res) => {
    try {
      const collaborations = await storage.getCollaborations();
      res.json(collaborations);
    } catch (error) {
      console.error("Error fetching collaborations:", error);
      res.status(500).json({ message: "Failed to fetch collaborations" });
    }
  });

  // Grading routes
  app.get('/api/grading-requests', isAuthenticated, async (req, res) => {
    try {
      // Mock grading requests
      const gradingRequests = [
        {
          id: 'gr-1',
          diamondId: 'URR-000001',
          requestDate: new Date(),
          status: 'pending',
          estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priority: 'high',
          location: 'mumbai'
        },
        {
          id: 'gr-2',
          diamondId: 'URR-000002',
          requestDate: new Date(),
          status: 'in_progress',
          estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          priority: 'medium',
          location: 'antwerp'
        }
      ];
      res.json(gradingRequests);
    } catch (error) {
      console.error("Error fetching grading requests:", error);
      res.status(500).json({ message: "Failed to fetch grading requests" });
    }
  });

  // Market analysis routes
  app.get('/api/market-analysis', isAuthenticated, async (req, res) => {
    try {
      const marketData = {
        trends: {
          demand: 'increasing',
          priceMovement: 'stable',
          popularShapes: ['round', 'princess', 'oval'],
          growthRate: 12.5
        },
        pricing: {
          averagePricePerCarat: 8450,
          premiumShapes: ['round', 'cushion'],
          discountShapes: ['marquise', 'pear']
        },
        forecast: {
          nextQuarter: 'positive',
          yearEnd: 'strong',
          keyDrivers: ['industrial demand', 'jewelry market recovery']
        }
      };
      res.json(marketData);
    } catch (error) {
      console.error("Error fetching market analysis:", error);
      res.status(500).json({ message: "Failed to fetch market analysis" });
    }
  });

  // Jewelry brands routes
  app.get('/api/jewelry-brands', isAuthenticated, async (req, res) => {
    try {
      const brands = [
        {
          id: 'brand-1',
          name: 'Brilliant Luxe',
          partnershipType: 'exclusive',
          monthlyOrder: 1250,
          preferredShapes: ['round', 'princess'],
          qualityRequirements: 'VS1+',
          location: 'new_york',
          contactPerson: 'Sarah Johnson',
          contractValue: 15000000
        },
        {
          id: 'brand-2',
          name: 'Elite Diamonds',
          partnershipType: 'preferred',
          monthlyOrder: 800,
          preferredShapes: ['oval', 'cushion'],
          qualityRequirements: 'VS2+',
          location: 'hong_kong',
          contactPerson: 'Michael Chen',
          contractValue: 9500000
        }
      ];
      res.json(brands);
    } catch (error) {
      console.error("Error fetching jewelry brands:", error);
      res.status(500).json({ message: "Failed to fetch jewelry brands" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}