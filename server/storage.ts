// In-memory storage implementation for easy Ubuntu deployment
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Diamond operations
  getDiamonds(params?: {
    limit?: number;
    offset?: number;
    location?: string;
    status?: string;
    search?: string;
  }): Promise<{ diamonds: Diamond[]; total: number }>;
  getDiamond(id: string): Promise<Diamond | undefined>;
  createDiamond(diamond: InsertDiamond): Promise<Diamond>;
  updateDiamond(id: string, diamond: Partial<InsertDiamond>): Promise<Diamond>;
  deleteDiamond(id: string): Promise<void>;
  
  // R&D Project operations
  getRdProjects(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    category?: string;
  }): Promise<{ projects: RdProject[]; total: number }>;
  getRdProject(id: string): Promise<RdProject | undefined>;
  createRdProject(project: InsertRdProject): Promise<RdProject>;
  updateRdProject(id: string, project: Partial<InsertRdProject>): Promise<RdProject>;
  
  // Manufacturing operations
  getRoughDiamonds(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    location?: string;
  }): Promise<{ roughDiamonds: RoughDiamond[]; total: number }>;
  getRoughDiamond(id: string): Promise<RoughDiamond | undefined>;
  createRoughDiamond(rough: InsertRoughDiamond): Promise<RoughDiamond>;
  getCuttingPlans(roughDiamondId: string): Promise<CuttingPlan[]>;
  createCuttingPlan(plan: InsertCuttingPlan): Promise<CuttingPlan>;
  selectCuttingPlan(planId: string): Promise<CuttingPlan>;
  
  // Equipment operations
  getGrowingEquipment(location?: string): Promise<GrowingEquipment[]>;
  updateGrowingEquipment(id: string, equipment: Partial<InsertGrowingEquipment>): Promise<GrowingEquipment>;
  
  // Industrial operations
  getIndustrialAllocations(): Promise<IndustrialAllocation[]>;
  createIndustrialAllocation(allocation: any): Promise<IndustrialAllocation>;
  
  // Collaboration operations
  getCollaborations(): Promise<Collaboration[]>;
  createCollaboration(collaboration: any): Promise<Collaboration>;
  
  // Team operations
  getProjectTeamMembers(projectId: string): Promise<ProjectTeamMember[]>;
  addProjectTeamMember(member: any): Promise<ProjectTeamMember>;
}

// Type definitions
export type User = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UpsertUser = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
};

export type Diamond = {
  id: string;
  diamondId: string;
  carat: number;
  cut: string;
  color: string;
  clarity: string;
  certification: string;
  price: number;
  location: string;
  status: string;
  createdAt: Date;
};

export type InsertDiamond = Omit<Diamond, 'id' | 'createdAt'>;

export type RdProject = {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  budget: number;
  startDate: Date;
  endDate?: Date | null;
  leadResearcher: string;
  location: string;
  createdAt: Date;
};

export type InsertRdProject = Omit<RdProject, 'id' | 'createdAt'>;

export type RoughDiamond = {
  id: string;
  roughId: string;
  carat: number;
  color: string;
  clarity: string;
  location: string;
  status: string;
  estimatedYield: string;
  acquisitionDate: Date;
  createdAt: Date;
};

export type InsertRoughDiamond = Omit<RoughDiamond, 'id' | 'createdAt'>;

export type CuttingPlan = {
  id: string;
  roughDiamondId: string;
  plannerId: string;
  targetShape: string;
  targetCarat: number;
  targetGrade: string;
  estimatedYield: number;
  estimatedValue: number;
  status: string;
  plannedStartDate: Date;
  plannedCompletionDate: Date;
  notes?: string | null;
  createdAt: Date;
};

export type InsertCuttingPlan = Omit<CuttingPlan, 'id' | 'createdAt'>;

export type GrowingEquipment = {
  id: string;
  equipmentId: string;
  type: string;
  status: string;
  location: string;
  capacity: number;
  currentLoad: number;
  temperature: number;
  pressure: number;
  cycleTime: number;
  lastMaintenance: Date;
  nextMaintenance: Date;
};

export type InsertGrowingEquipment = Omit<GrowingEquipment, 'id'>;

export type IndustrialAllocation = {
  id: string;
  allocationId: string;
  application: string;
  clientName: string;
  quantity: number;
  specifications: string;
  deliveryDate: Date;
  status: string;
  location: string;
  createdAt: Date;
};

export type Collaboration = {
  id: string;
  partnerName: string;
  partnerType: string;
  projectTitle: string;
  status: string;
  startDate: Date;
  endDate?: Date | null;
  focusArea: string;
  budget: number;
  location: string;
  contactPerson: string;
  createdAt: Date;
};

export type ProjectTeamMember = {
  id: string;
  projectId: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  location: string;
  joinedAt: Date;
};

// In-memory storage implementation
export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private diamonds: Map<string, Diamond> = new Map();
  private rdProjects: Map<string, RdProject> = new Map();
  private roughDiamonds: Map<string, RoughDiamond> = new Map();
  private cuttingPlans: Map<string, CuttingPlan> = new Map();
  private growingEquipment: Map<string, GrowingEquipment> = new Map();
  private industrialAllocations: Map<string, IndustrialAllocation> = new Map();
  private collaborations: Map<string, Collaboration> = new Map();
  private projectTeamMembers: Map<string, ProjectTeamMember> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed users
    const sampleUsers: User[] = [
      {
        id: "46981679",
        email: "umang@themailwhale.com",
        firstName: "Umang",
        lastName: "Shah",
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    sampleUsers.forEach(user => this.users.set(user.id, user));

    // Seed diamonds (100+ for comprehensive inventory)
    const locations = ['mumbai', 'hong_kong', 'dubai', 'antwerp', 'new_york', 'odisha'];
    const colors = ['D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const clarities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
    const cuts = ['Excellent', 'Very Good', 'Good'];
    const certifications = ['GIA', 'AGS', 'Gübelin', 'SSEF'];
    
    for (let i = 1; i <= 120; i++) {
      const diamond: Diamond = {
        id: `d-${i}`,
        diamondId: `URR-${String(i).padStart(6, '0')}`,
        carat: Math.random() * 3 + 0.5,
        cut: cuts[Math.floor(Math.random() * cuts.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        clarity: clarities[Math.floor(Math.random() * clarities.length)],
        certification: certifications[Math.floor(Math.random() * certifications.length)],
        price: Math.floor(Math.random() * 50000 + 10000),
        location: locations[Math.floor(Math.random() * locations.length)],
        status: Math.random() > 0.8 ? 'reserved' : 'available',
        createdAt: new Date()
      };
      this.diamonds.set(diamond.id, diamond);
    }

    // Seed rough diamonds
    const roughStatuses = ['planning', 'in_production', 'completed'];
    for (let i = 1; i <= 50; i++) {
      const rough: RoughDiamond = {
        id: `rough-${i}`,
        roughId: `RGH-${String(i).padStart(4, '0')}`,
        carat: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        clarity: clarities[Math.floor(Math.random() * clarities.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        status: roughStatuses[Math.floor(Math.random() * roughStatuses.length)],
        estimatedYield: `${Math.floor(Math.random() * 30 + 25)}%`,
        acquisitionDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      };
      this.roughDiamonds.set(rough.id, rough);
    }

    // Seed R&D projects
    const rdCategories = ['growth_optimization', 'quantum_applications', 'industrial_applications', 'sustainability'];
    const rdStatuses = ['active', 'completed', 'on_hold'];
    const sampleProjects = [
      { title: 'Quantum Dot Enhancement', description: 'Developing quantum dots for advanced computing applications' },
      { title: 'CVD Growth Optimization', description: 'Optimizing chemical vapor deposition for larger diamonds' },
      { title: 'Semiconductor Integration', description: 'Diamond semiconductors for high-power electronics' },
      { title: 'Medical Device Applications', description: 'Biocompatible diamond coatings for medical implants' }
    ];

    sampleProjects.forEach((proj, i) => {
      const project: RdProject = {
        id: `rd-${i + 1}`,
        title: proj.title,
        description: proj.description,
        status: rdStatuses[Math.floor(Math.random() * rdStatuses.length)],
        category: rdCategories[Math.floor(Math.random() * rdCategories.length)],
        budget: Math.floor(Math.random() * 2000000 + 500000),
        startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        endDate: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000) : null,
        leadResearcher: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 4)]}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        createdAt: new Date()
      };
      this.rdProjects.set(project.id, project);
    });

    // Seed growing equipment
    const equipmentTypes = ['CVD Reactor', 'HPHT Press', 'Plasma Generator', 'Ion Beam'];
    const equipmentStatuses = ['operational', 'maintenance', 'idle'];
    
    for (let i = 1; i <= 20; i++) {
      const equipment: GrowingEquipment = {
        id: `eq-${i}`,
        equipmentId: `${equipmentTypes[i % 4].split(' ')[0].toUpperCase()}-${String(i).padStart(3, '0')}`,
        type: equipmentTypes[i % 4],
        status: equipmentStatuses[Math.floor(Math.random() * equipmentStatuses.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        capacity: Math.floor(Math.random() * 100 + 50),
        currentLoad: Math.floor(Math.random() * 80 + 10),
        temperature: Math.floor(Math.random() * 500 + 800),
        pressure: Math.floor(Math.random() * 50 + 20),
        cycleTime: Math.floor(Math.random() * 48 + 12),
        lastMaintenance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        nextMaintenance: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
      };
      this.growingEquipment.set(equipment.id, equipment);
    }

    // Seed industrial allocations
    const applications = ['semiconductor', 'cutting_tools', 'medical', 'optical', 'military', 'space', 'quantum_computing'];
    const allocationStatuses = ['pending', 'in_progress', 'completed', 'shipped'];
    
    for (let i = 1; i <= 15; i++) {
      const allocation: IndustrialAllocation = {
        id: `alloc-${i}`,
        allocationId: `IND-${String(i).padStart(4, '0')}`,
        application: applications[Math.floor(Math.random() * applications.length)],
        clientName: `Client ${i}`,
        quantity: Math.floor(Math.random() * 1000 + 100),
        specifications: 'High precision, temperature resistant',
        deliveryDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
        status: allocationStatuses[Math.floor(Math.random() * allocationStatuses.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        createdAt: new Date()
      };
      this.industrialAllocations.set(allocation.id, allocation);
    }

    // Seed collaborations
    const partnerTypes = ['university', 'research_institute', 'corporation', 'government'];
    const collaborationStatuses = ['active', 'completed', 'proposed'];
    const sampleCollaborations = [
      { partner: 'MIT Diamond Research Lab', project: 'Quantum Diamond Magnetometry' },
      { partner: 'Stanford Materials Science', project: 'Diamond Semiconductor Development' },
      { partner: 'Oxford Nanotechnology Center', project: 'Medical Diamond Applications' },
      { partner: 'CERN Physics Laboratory', project: 'Diamond Particle Detectors' }
    ];

    sampleCollaborations.forEach((collab, i) => {
      const collaboration: Collaboration = {
        id: `collab-${i + 1}`,
        partnerName: collab.partner,
        partnerType: partnerTypes[Math.floor(Math.random() * partnerTypes.length)],
        projectTitle: collab.project,
        status: collaborationStatuses[Math.floor(Math.random() * collaborationStatuses.length)],
        startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        endDate: Math.random() > 0.3 ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000) : null,
        focusArea: 'Advanced Materials Research',
        budget: Math.floor(Math.random() * 1500000 + 250000),
        location: locations[Math.floor(Math.random() * locations.length)],
        contactPerson: `Dr. ${['Anderson', 'Taylor', 'Wilson', 'Davis'][i]}`,
        createdAt: new Date()
      };
      this.collaborations.set(collaboration.id, collaboration);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = this.users.get(userData.id);
    const user: User = {
      ...existing,
      ...userData,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date()
    };
    this.users.set(userData.id, user);
    return user;
  }

  // Diamond operations
  async getDiamonds(params?: {
    limit?: number;
    offset?: number;
    location?: string;
    status?: string;
    search?: string;
  }): Promise<{ diamonds: Diamond[]; total: number }> {
    let diamonds = Array.from(this.diamonds.values());
    
    // Apply filters
    if (params?.location) {
      diamonds = diamonds.filter(d => d.location === params.location);
    }
    if (params?.status) {
      diamonds = diamonds.filter(d => d.status === params.status);
    }
    if (params?.search) {
      const search = params.search.toLowerCase();
      diamonds = diamonds.filter(d => 
        d.diamondId.toLowerCase().includes(search) ||
        d.color.toLowerCase().includes(search) ||
        d.clarity.toLowerCase().includes(search)
      );
    }

    const total = diamonds.length;
    const offset = params?.offset || 0;
    const limit = params?.limit || 10;
    const paginatedDiamonds = diamonds.slice(offset, offset + limit);

    return { diamonds: paginatedDiamonds, total };
  }

  async getDiamond(id: string): Promise<Diamond | undefined> {
    return this.diamonds.get(id);
  }

  async createDiamond(diamond: InsertDiamond): Promise<Diamond> {
    const id = `d-${Date.now()}`;
    const newDiamond: Diamond = {
      ...diamond,
      id,
      createdAt: new Date()
    };
    this.diamonds.set(id, newDiamond);
    return newDiamond;
  }

  async updateDiamond(id: string, diamond: Partial<InsertDiamond>): Promise<Diamond> {
    const existing = this.diamonds.get(id);
    if (!existing) {
      throw new Error('Diamond not found');
    }
    const updated: Diamond = { ...existing, ...diamond };
    this.diamonds.set(id, updated);
    return updated;
  }

  async deleteDiamond(id: string): Promise<void> {
    this.diamonds.delete(id);
  }

  // R&D Project operations
  async getRdProjects(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    category?: string;
  }): Promise<{ projects: RdProject[]; total: number }> {
    let projects = Array.from(this.rdProjects.values());
    
    if (params?.status) {
      projects = projects.filter(p => p.status === params.status);
    }
    if (params?.category) {
      projects = projects.filter(p => p.category === params.category);
    }

    const total = projects.length;
    const offset = params?.offset || 0;
    const limit = params?.limit || 10;
    const paginatedProjects = projects.slice(offset, offset + limit);

    return { projects: paginatedProjects, total };
  }

  async getRdProject(id: string): Promise<RdProject | undefined> {
    return this.rdProjects.get(id);
  }

  async createRdProject(project: InsertRdProject): Promise<RdProject> {
    const id = `rd-${Date.now()}`;
    const newProject: RdProject = {
      ...project,
      id,
      createdAt: new Date()
    };
    this.rdProjects.set(id, newProject);
    return newProject;
  }

  async updateRdProject(id: string, project: Partial<InsertRdProject>): Promise<RdProject> {
    const existing = this.rdProjects.get(id);
    if (!existing) {
      throw new Error('Project not found');
    }
    const updated: RdProject = { ...existing, ...project };
    this.rdProjects.set(id, updated);
    return updated;
  }

  // Manufacturing operations
  async getRoughDiamonds(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    location?: string;
  }): Promise<{ roughDiamonds: RoughDiamond[]; total: number }> {
    let roughDiamonds = Array.from(this.roughDiamonds.values());
    
    if (params?.status) {
      roughDiamonds = roughDiamonds.filter(r => r.status === params.status);
    }
    if (params?.location) {
      roughDiamonds = roughDiamonds.filter(r => r.location === params.location);
    }

    const total = roughDiamonds.length;
    const offset = params?.offset || 0;
    const limit = params?.limit || 10;
    const paginatedRough = roughDiamonds.slice(offset, offset + limit);

    return { roughDiamonds: paginatedRough, total };
  }

  async getRoughDiamond(id: string): Promise<RoughDiamond | undefined> {
    return this.roughDiamonds.get(id);
  }

  async createRoughDiamond(rough: InsertRoughDiamond): Promise<RoughDiamond> {
    const id = `rough-${Date.now()}`;
    const newRough: RoughDiamond = {
      ...rough,
      id,
      createdAt: new Date()
    };
    this.roughDiamonds.set(id, newRough);
    return newRough;
  }

  async getCuttingPlans(roughDiamondId: string): Promise<CuttingPlan[]> {
    return Array.from(this.cuttingPlans.values()).filter(p => p.roughDiamondId === roughDiamondId);
  }

  async createCuttingPlan(plan: InsertCuttingPlan): Promise<CuttingPlan> {
    const id = `plan-${Date.now()}`;
    const newPlan: CuttingPlan = {
      ...plan,
      id,
      createdAt: new Date()
    };
    this.cuttingPlans.set(id, newPlan);
    return newPlan;
  }

  async selectCuttingPlan(planId: string): Promise<CuttingPlan> {
    const plan = this.cuttingPlans.get(planId);
    if (!plan) {
      throw new Error('Cutting plan not found');
    }
    return plan;
  }

  // Equipment operations
  async getGrowingEquipment(location?: string): Promise<GrowingEquipment[]> {
    let equipment = Array.from(this.growingEquipment.values());
    if (location) {
      equipment = equipment.filter(e => e.location === location);
    }
    return equipment;
  }

  async updateGrowingEquipment(id: string, equipment: Partial<InsertGrowingEquipment>): Promise<GrowingEquipment> {
    const existing = this.growingEquipment.get(id);
    if (!existing) {
      throw new Error('Equipment not found');
    }
    const updated: GrowingEquipment = { ...existing, ...equipment };
    this.growingEquipment.set(id, updated);
    return updated;
  }

  // Industrial operations
  async getIndustrialAllocations(): Promise<IndustrialAllocation[]> {
    return Array.from(this.industrialAllocations.values());
  }

  async createIndustrialAllocation(allocation: any): Promise<IndustrialAllocation> {
    const id = `alloc-${Date.now()}`;
    const newAllocation: IndustrialAllocation = {
      ...allocation,
      id,
      createdAt: new Date()
    };
    this.industrialAllocations.set(id, newAllocation);
    return newAllocation;
  }

  // Collaboration operations
  async getCollaborations(): Promise<Collaboration[]> {
    return Array.from(this.collaborations.values());
  }

  async createCollaboration(collaboration: any): Promise<Collaboration> {
    const id = `collab-${Date.now()}`;
    const newCollaboration: Collaboration = {
      ...collaboration,
      id,
      createdAt: new Date()
    };
    this.collaborations.set(id, newCollaboration);
    return newCollaboration;
  }

  // Team operations
  async getProjectTeamMembers(projectId: string): Promise<ProjectTeamMember[]> {
    return Array.from(this.projectTeamMembers.values()).filter(m => m.projectId === projectId);
  }

  async addProjectTeamMember(member: any): Promise<ProjectTeamMember> {
    const id = `member-${Date.now()}`;
    const newMember: ProjectTeamMember = {
      ...member,
      id,
      joinedAt: new Date()
    };
    this.projectTeamMembers.set(id, newMember);
    return newMember;
  }
}

export const storage = new MemoryStorage();