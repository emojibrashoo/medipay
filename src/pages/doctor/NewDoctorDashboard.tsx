import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockMedicalRecords, mockPatients, mockInstitutions } from "@/data/mockData";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Stethoscope, 
  FileText, 
  Activity, 
  PlusCircle, 
  Calendar,
  DollarSign,
  Users,
  Clock,
  Eye,
  EyeOff,
  Pill,
  Clipboard
} from "lucide-react";
import { CreateMedicalRecordTransaction, CreatePrescriptionTransaction } from "@/components/sui/BlockchainTransaction";

interface PrescriptionForm {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  unitPrice: number;
  instructions: string;
}

export default function NewDoctorDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPricing, setShowPricing] = useState(false);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isCreatingPrescription, setIsCreatingPrescription] = useState(false);
  
  // Form states
  const [noteForm, setNoteForm] = useState({
    patientId: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    visitDate: new Date().toISOString().split('T')[0],
    totalCost: 0,
    insuranceCoverage: 0,
    patientResponsibility: 0
  });
  
  const [prescriptionForm, setPrescriptionForm] = useState<PrescriptionForm>({
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    quantity: 0,
    unitPrice: 0,
    instructions: ''
  });

  // Filter medical records for current doctor
  const doctorRecords = mockMedicalRecords.filter(record => record.doctorId === user?.id);
  const recentRecords = doctorRecords.slice(0, 3);

  // Calculate stats
  const totalPatients = new Set(doctorRecords.map(record => record.patientId)).size;
  const totalRecords = doctorRecords.length;
  const totalRevenue = doctorRecords.reduce((sum, record) => sum + record.totalCost, 0);
  const avgCostPerVisit = totalRecords > 0 ? totalRevenue / totalRecords : 0;

  const stats = [
    {
      title: "Total Records",
      value: totalRecords.toString(),
      icon: FileText,
      description: "Medical records created",
      color: "text-primary"
    },
    {
      title: "Active Patients",
      value: totalPatients.toString(),
      icon: Users,
      description: "Unique patients",
      color: "text-confirmed"
    },
    {
      title: "Avg. Visit Cost",
      value: `$${avgCostPerVisit.toFixed(0)}`,
      icon: DollarSign,
      description: "Per consultation",
      color: "text-paid"
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: Activity,
      description: "All time earnings",
      color: "text-paid"
    }
  ];

  const handleCreateNote = () => {
    if (!noteForm.patientId || !noteForm.diagnosis || !noteForm.treatment) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would save to the database
    toast({
      title: "Medical Note Created",
      description: "The medical record has been successfully created.",
    });
    
    setIsCreatingNote(false);
    setNoteForm({
      patientId: '',
      diagnosis: '',
      treatment: '',
      notes: '',
      visitDate: new Date().toISOString().split('T')[0],
      totalCost: 0,
      insuranceCoverage: 0,
      patientResponsibility: 0
    });
  };

  const handleCreatePrescription = () => {
    if (!prescriptionForm.medicationName || !prescriptionForm.dosage || !prescriptionForm.frequency) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required prescription fields.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would save to the database
    toast({
      title: "Prescription Created",
      description: "The prescription has been successfully created.",
    });
    
    setIsCreatingPrescription(false);
    setPrescriptionForm({
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: '',
      quantity: 0,
      unitPrice: 0,
      instructions: ''
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="medical-card p-6 bg-gradient-hero text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {user?.name}!
            </h1>
            <p className="text-white/90">
              Create medical records and prescriptions with HIPAA-compliant pricing
            </p>
          </div>
          <Stethoscope className="w-16 h-16 text-white/80" />
        </div>
      </div>

      {/* HIPAA Compliance Notice */}
      <Card className="medical-card border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Eye className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-orange-800">HIPAA Compliance Notice</p>
              <p className="text-sm text-orange-700">
                Pricing information is hidden by default to protect patient privacy. 
                Click the eye icon to toggle pricing visibility when needed for billing.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPricing(!showPricing)}
              className="ml-auto"
            >
              {showPricing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPricing ? 'Hide' : 'Show'} Pricing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="medical-card transition-smooth hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-medical flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Create medical records and prescriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              className="h-auto p-6 flex-col gap-3 bg-gradient-medical hover:scale-105 transition-smooth"
              onClick={() => setIsCreatingNote(true)}
            >
              <Clipboard className="w-8 h-8" />
              <div className="text-center">
                <p className="font-semibold">Create Medical Note</p>
                <p className="text-sm opacity-90">Document patient visit</p>
              </div>
            </Button>
            
            <Button 
              variant="outline"
              className="h-auto p-6 flex-col gap-3 hover:scale-105 transition-smooth"
              onClick={() => setIsCreatingPrescription(true)}
            >
              <Pill className="w-8 h-8" />
              <div className="text-center">
                <p className="font-semibold">Create Prescription</p>
                <p className="text-sm text-muted-foreground">Prescribe medication</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Medical Note Modal */}
      {isCreatingNote && (
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clipboard className="w-5 h-5" />
              Create Medical Note
            </CardTitle>
            <CardDescription>
              Document patient visit and treatment details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient">Patient</Label>
                <Select value={noteForm.patientId} onValueChange={(value) => setNoteForm({...noteForm, patientId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPatients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="visitDate">Visit Date</Label>
                <Input
                  id="visitDate"
                  type="date"
                  value={noteForm.visitDate}
                  onChange={(e) => setNoteForm({...noteForm, visitDate: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Input
                id="diagnosis"
                placeholder="Enter diagnosis"
                value={noteForm.diagnosis}
                onChange={(e) => setNoteForm({...noteForm, diagnosis: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="treatment">Treatment *</Label>
              <Textarea
                id="treatment"
                placeholder="Describe treatment provided"
                value={noteForm.treatment}
                onChange={(e) => setNoteForm({...noteForm, treatment: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional observations or recommendations"
                value={noteForm.notes}
                onChange={(e) => setNoteForm({...noteForm, notes: e.target.value})}
              />
            </div>

            {showPricing && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label htmlFor="totalCost">Total Cost</Label>
                  <Input
                    id="totalCost"
                    type="number"
                    placeholder="0.00"
                    value={noteForm.totalCost}
                    onChange={(e) => setNoteForm({...noteForm, totalCost: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="insuranceCoverage">Insurance Coverage</Label>
                  <Input
                    id="insuranceCoverage"
                    type="number"
                    placeholder="0.00"
                    value={noteForm.insuranceCoverage}
                    onChange={(e) => setNoteForm({...noteForm, insuranceCoverage: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="patientResponsibility">Patient Responsibility</Label>
                  <Input
                    id="patientResponsibility"
                    type="number"
                    placeholder="0.00"
                    value={noteForm.patientResponsibility}
                    onChange={(e) => setNoteForm({...noteForm, patientResponsibility: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleCreateNote}>
                Create Medical Note
              </Button>
              <Button variant="outline" onClick={() => setIsCreatingNote(false)}>
                Cancel
              </Button>
            </div>

            {/* Blockchain Transaction Component */}
            {noteForm.patientId && noteForm.diagnosis && noteForm.treatment && (
              <div className="mt-6">
                <CreateMedicalRecordTransaction
                  patientId={noteForm.patientId}
                  doctorId={user?.id || ''}
                  institutionId="2" // Default institution ID
                  diagnosis={noteForm.diagnosis}
                  treatment={noteForm.treatment}
                  notes={noteForm.notes}
                  visitDate={noteForm.visitDate}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Prescription Modal */}
      {isCreatingPrescription && (
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Create Prescription
            </CardTitle>
            <CardDescription>
              Prescribe medication with dosage and instructions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="medication">Medication Name *</Label>
                <Input
                  id="medication"
                  placeholder="Enter medication name"
                  value={prescriptionForm.medicationName}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, medicationName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 10mg"
                  value={prescriptionForm.dosage}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, dosage: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frequency">Frequency *</Label>
                <Input
                  id="frequency"
                  placeholder="e.g., Twice daily"
                  value={prescriptionForm.frequency}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, frequency: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 30 days"
                  value={prescriptionForm.duration}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, duration: e.target.value})}
                />
              </div>
            </div>

            {showPricing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    value={prescriptionForm.quantity}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, quantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="unitPrice">Unit Price</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    placeholder="0.00"
                    value={prescriptionForm.unitPrice}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, unitPrice: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Special instructions for the patient"
                value={prescriptionForm.instructions}
                onChange={(e) => setPrescriptionForm({...prescriptionForm, instructions: e.target.value})}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreatePrescription}>
                Create Prescription
              </Button>
              <Button variant="outline" onClick={() => setIsCreatingPrescription(false)}>
                Cancel
              </Button>
            </div>

            {/* Blockchain Transaction Component */}
            {prescriptionForm.medicationName && prescriptionForm.dosage && prescriptionForm.frequency && (
              <div className="mt-6">
                <CreatePrescriptionTransaction
                  patientId={noteForm.patientId || ''}
                  doctorId={user?.id || ''}
                  medicationName={prescriptionForm.medicationName}
                  dosage={prescriptionForm.dosage}
                  frequency={prescriptionForm.frequency}
                  duration={prescriptionForm.duration}
                  quantity={prescriptionForm.quantity}
                  instructions={prescriptionForm.instructions}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Medical Records */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Medical Records
              </CardTitle>
              <CardDescription>
                Your latest patient documentation
              </CardDescription>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate('/doctor/records')}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentRecords.length > 0 ? (
            <div className="space-y-4">
              {recentRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold">{record.diagnosis}</h4>
                      <Badge variant="outline">{record.patientName}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {record.treatment}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(record.visitDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {showPricing ? (
                      <div>
                        <p className="font-bold text-lg">${record.totalCost}</p>
                        <p className="text-sm text-muted-foreground">
                          Insurance: ${record.insuranceCoverage}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Patient: ${record.patientResponsibility}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-lg">***</p>
                        <p className="text-sm text-muted-foreground">Pricing hidden</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No medical records yet</p>
              <p className="text-muted-foreground mb-4">
                Start by creating your first medical note
              </p>
              <Button onClick={() => setIsCreatingNote(true)}>
                Create Medical Note
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
