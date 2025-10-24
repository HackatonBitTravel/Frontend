import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Key, 
  Bell, 
  Globe,
  Save,
  Camera,
  Shield
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getUserProfile, updateUserProfile, changePassword } from "@/lib/api";

const Profile = () => {
  const { user, token, logout, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // États pour les différents onglets
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Données du profil
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    language: "fr",
    notifications: {
      email: true,
      sms: true,
      push: true
    },
    paymentMethods: [] as any[],
    security: {
      twoFactor: false,
      passwordLastChanged: new Date()
    }
  });
  
  // Données temporaires pour l'édition
  const [editData, setEditData] = useState(profileData);

  // Initialiser les données du profil
  useEffect(() => {
    if (!user || !token) {
      navigate("/signin");
      return;
    }
    
    // Charger le profil depuis l'API
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await getUserProfile(token);
        setProfileData({
          fullName: profile.full_name || profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
          language: profile.language || "fr",
          notifications: {
            email: profile.notifications?.email !== false, // true par défaut
            sms: profile.notifications?.sms !== false,
            push: profile.notifications?.push !== false
          },
          paymentMethods: profile.payment_methods || [],
          security: {
            twoFactor: profile.security?.twoFactor || false,
            passwordLastChanged: profile.security?.passwordLastChanged ? new Date(profile.security.passwordLastChanged) : new Date()
          }
        });
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du profil.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, token, navigate, toast]);

  // Mettre à jour les données d'édition quand les données du profil changent
  useEffect(() => {
    setEditData(profileData);
  }, [profileData]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const updatedUser = await updateUserProfile(token, {
        full_name: editData.fullName,
        email: editData.email,
        phone: editData.phone,
        address: editData.address,
        language: editData.language,
        notifications: editData.notifications
      });
      
      setProfileData(editData);
      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le profil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    // Pour l'instant, on affiche un message
    toast({
      title: "Changement de mot de passe",
      description: "Fonctionnalité à implémenter - redirection vers la page de changement de mot de passe.",
    });
    // TODO: Implémenter la logique de changement de mot de passe
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté de votre compte.",
    });
  };

  // Navigation par onglets
  const tabs = [
    { id: "personal", label: "Informations personnelles", icon: User },
    { id: "preferences", label: "Préférences", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payment", label: "Moyens de paiement", icon: CreditCard },
    { id: "security", label: "Sécurité", icon: Shield },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
        <Chatbot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar de navigation */}
            <div className="md:w-64 flex-shrink-0">
              <Card className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center mx-auto mb-3">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-semibold">{profileData.fullName || "Utilisateur"}</h2>
                  <p className="text-sm text-muted-foreground">{profileData.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Membre depuis {user?.created_at ? format(new Date(user.created_at), "MMMM yyyy", { locale: fr }) : "N/A"}
                  </p>
                </div>
                
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                        disabled={isLoading}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
                
                <div className="mt-6 pt-6 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              </Card>
            </div>
            
            {/* Contenu principal */}
            <div className="flex-1">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </h1>
                    <p className="text-muted-foreground">
                      Gérez vos informations et préférences
                    </p>
                  </div>
                  {activeTab !== "security" && activeTab !== "payment" && (
                    <div>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                            Annuler
                          </Button>
                          <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Enregistrement...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Enregistrer
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <Button onClick={() => setIsEditing(true)} disabled={isLoading}>
                          Modifier
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Contenu selon l'onglet actif */}
                {activeTab === "personal" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nom complet</Label>
                        {isEditing ? (
                          <Input
                            id="fullName"
                            value={editData.fullName}
                            onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                            disabled={isLoading}
                          />
                        ) : (
                          <p className="font-medium">{profileData.fullName || "Non renseigné"}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                            disabled={isLoading}
                          />
                        ) : (
                          <p className="font-medium">{profileData.email || "Non renseigné"}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            type="tel"
                            value={editData.phone}
                            onChange={(e) => setEditData({...editData, phone: e.target.value})}
                            disabled={isLoading}
                          />
                        ) : (
                          <p className="font-medium">{profileData.phone || "Non renseigné"}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Adresse</Label>
                        {isEditing ? (
                          <Input
                            id="address"
                            value={editData.address}
                            onChange={(e) => setEditData({...editData, address: e.target.value})}
                            disabled={isLoading}
                          />
                        ) : (
                          <p className="font-medium">{profileData.address || "Non renseigné"}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-3">Informations du compte</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">ID Utilisateur</p>
                          <p className="font-mono">{user?.id?.substring(0, 8) || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Date d'inscription</p>
                          <p>{user?.created_at ? format(new Date(user.created_at), "dd MMMM yyyy", { locale: fr }) : "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Dernière connexion</p>
                          <p>{user?.last_login ? format(new Date(user.last_login), "dd MMMM yyyy HH:mm", { locale: fr }) : "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "preferences" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Langue préférée</Label>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Button 
                            variant={editData.language === "fr" ? "default" : "outline"}
                            onClick={() => setEditData({...editData, language: "fr"})}
                            disabled={isLoading}
                          >
                            Français
                          </Button>
                          <Button 
                            variant={editData.language === "wo" ? "default" : "outline"}
                            onClick={() => setEditData({...editData, language: "wo"})}
                            disabled={isLoading}
                          >
                            Wolof
                          </Button>
                        </div>
                      ) : (
                        <p className="font-medium">
                          {profileData.language === "fr" ? "Français" : "Wolof"}
                        </p>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-3">Préférences de voyage</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Sièges préférés</p>
                            <p className="text-sm text-muted-foreground">Fenêtre ou couloir</p>
                          </div>
                          {isEditing ? (
                            <select className="border rounded p-2" disabled={isLoading}>
                              <option>Indifférent</option>
                              <option>Fenêtre</option>
                              <option>Couloir</option>
                            </select>
                          ) : (
                            <span>Indifférent</span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notifications de retard</p>
                            <p className="text-sm text-muted-foreground">Recevoir des alertes</p>
                          </div>
                          {isEditing ? (
                            <input 
                              type="checkbox" 
                              defaultChecked 
                              disabled={isLoading}
                            />
                          ) : (
                            <span>Oui</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Notifications par email</p>
                            <p className="text-sm text-muted-foreground">Pour les confirmations et alertes importantes</p>
                          </div>
                        </div>
                        {isEditing ? (
                          <input 
                            type="checkbox" 
                            checked={editData.notifications.email}
                            onChange={(e) => setEditData({
                              ...editData, 
                              notifications: {...editData.notifications, email: e.target.checked}
                            })}
                            disabled={isLoading}
                          />
                        ) : (
                          <span>{profileData.notifications.email ? "Activé" : "Désactivé"}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Notifications SMS</p>
                            <p className="text-sm text-muted-foreground">Pour les alertes urgentes</p>
                          </div>
                        </div>
                        {isEditing ? (
                          <input 
                            type="checkbox" 
                            checked={editData.notifications.sms}
                            onChange={(e) => setEditData({
                              ...editData, 
                              notifications: {...editData.notifications, sms: e.target.checked}
                            })}
                            disabled={isLoading}
                          />
                        ) : (
                          <span>{profileData.notifications.sms ? "Activé" : "Désactivé"}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Notifications push</p>
                            <p className="text-sm text-muted-foreground">Dans l'application</p>
                          </div>
                        </div>
                        {isEditing ? (
                          <input 
                            type="checkbox" 
                            checked={editData.notifications.push}
                            onChange={(e) => setEditData({
                              ...editData, 
                              notifications: {...editData.notifications, push: e.target.checked}
                            })}
                            disabled={isLoading}
                          />
                        ) : (
                          <span>{profileData.notifications.push ? "Activé" : "Désactivé"}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-3">Notifications par événements</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Rappel 24h avant le départ</span>
                          {isEditing ? <input type="checkbox" defaultChecked disabled={isLoading} /> : <span>Activé</span>}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Confirmation de réservation</span>
                          {isEditing ? <input type="checkbox" defaultChecked disabled={isLoading} /> : <span>Activé</span>}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Changements d'horaire</span>
                          {isEditing ? <input type="checkbox" defaultChecked disabled={isLoading} /> : <span>Activé</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "payment" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Moyens de paiement enregistrés</h3>
                      <Button variant="outline" size="sm" disabled={isLoading}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Ajouter un moyen
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {profileData.paymentMethods.length > 0 ? (
                        profileData.paymentMethods.map((method: any, index: number) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <CreditCard className="h-6 w-6" />
                                <div>
                                  <p className="font-medium">{method.type} se terminant par ••••{method.last4}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Expire le {method.expiry}
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" disabled={isLoading}>
                                Gérer
                              </Button>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                          <p className="text-muted-foreground">Aucun moyen de paiement enregistré</p>
                          <Button variant="outline" className="mt-3" disabled={isLoading}>
                            Ajouter un moyen de paiement
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-3">Préférences de paiement</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Moyen de paiement par défaut</span>
                          <span>Mobile Money</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Enregistrer les cartes pour paiement rapide</span>
                          <span>Activé</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Mot de passe</p>
                          <p className="text-sm text-muted-foreground">
                            Dernier changement : {format(profileData.security.passwordLastChanged, "dd MMMM yyyy", { locale: fr })}
                          </p>
                        </div>
                        <Button variant="outline" onClick={handleChangePassword} disabled={isLoading}>
                          Changer
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Authentification à deux facteurs</p>
                          <p className="text-sm text-muted-foreground">Ajoute une couche de sécurité supplémentaire</p>
                        </div>
                        <Button variant={profileData.security.twoFactor ? "default" : "outline"} disabled={isLoading}>
                          {profileData.security.twoFactor ? "Activé" : "Activer"}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-3">Sessions actives</h3>
                      <div className="space-y-3">
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Ce navigateur</p>
                              <p className="text-sm text-muted-foreground">Votre session actuelle</p>
                            </div>
                            <span className="text-green-500 text-sm">Actif</span>
                          </div>
                        </Card>
                        
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">iPhone de John</p>
                              <p className="text-sm text-muted-foreground">Dakar, SN • Il y a 2 jours</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-destructive" disabled={isLoading}>
                              Déconnecter
                            </Button>
                          </div>
                        </Card>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-3">Historique de sécurité</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Connexion depuis 192.168.1.100</span>
                          <span className="text-muted-foreground">Aujourd'hui à 09:30</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Changement de mot de passe</span>
                          <span className="text-muted-foreground">15 oct 2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Activation 2FA</span>
                          <span className="text-muted-foreground">10 oct 2025</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Profile;