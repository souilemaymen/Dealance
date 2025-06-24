// app/clients/page.jsx
"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Search, Filter, ChevronDown, ChevronUp, User } from 'lucide-react';
import NavbarMenuAcceuil from '@/components/NavbarMenuAcceuil';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    userType: 'all',
    minRating: 0,
    maxRating: 5,
    services: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  // Récupérer les clients depuis l'API
    useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch('/api/clients?userType=client');
        const data = await res.json();
        console.log("API Response:", data);
        if (res.ok) {
          setClients(data);
          setFilteredClients(data);
        } else {
          console.error('Failed to fetch clients:', data.error);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Appliquer les filtres et le tri
  useEffect(() => {
    let result = [...clients];
    
    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(client => 
        client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.companyName && client.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.services && client.services.some(service => 
          service.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }
    
    // Filtre par type d'utilisateur
    if (filters.userType !== 'all') {
      result = result.filter(client => client.userType === filters.userType);
    }
    
    // Filtre par note
    result = result.filter(client => 
      client.rating >= filters.minRating && client.rating <= filters.maxRating
    );
    
    // Filtre par services
    if (filters.services.length > 0) {
      result = result.filter(client => 
        client.services && client.services.some(service => 
          filters.services.includes(service)
        )
      );
    }
    
    // Tri
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      }
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.fullName.localeCompare(b.fullName) 
          : b.fullName.localeCompare(a.fullName);
      }
      return 0;
    });
    
    setFilteredClients(result);
  }, [clients, searchTerm, filters, sortBy, sortOrder]);

  // Services disponibles pour le filtre
  const availableServices = Array.from(
    new Set(clients.flatMap(client => client.services || []))
  );

  const toggleServiceFilter = (service) => {
    setFilters(prev => {
      if (prev.services.includes(service)) {
        return { ...prev, services: prev.services.filter(s => s !== service) };
      } else {
        return { ...prev, services: [...prev.services, service] };
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-50">
      <NavbarMenuAcceuil />
      
      {/* Contenu principal avec marge supérieure */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-8 md:pt-28 md:pb-12">
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent"
          >
            Nos Clients d'Élite
          </motion.h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez nos clients les mieux notés qui transforment leur industrie avec excellence et innovation.
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Rechercher clients, entreprises, services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Filter size={18} />
                Filtres
                {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-8 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="rating">Trier par note</option>
                  <option value="name">Trier par nom</option>
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none">
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              </div>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
              </button>
            </div>
          </div>
          
          {/* Filtres avancés */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'utilisateur
                </label>
                <select
                  value={filters.userType}
                  onChange={(e) => setFilters({...filters, userType: e.target.value})}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Tous les types</option>
                  <option value="client">Client individuel</option>
                  <option value="entreprise">Entreprise</option>
                  <option value="startup">Startup</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note minimale: {filters.minRating} étoiles
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) => setFilters({...filters, minRating: parseFloat(e.target.value)})}
                  className="w-full accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>5</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableServices.slice(0, 5).map(service => (
                    <button
                      key={service}
                      onClick={() => toggleServiceFilter(service)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.services.includes(service)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Liste des clients */}
        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-900">Aucun client trouvé</h3>
            <p className="mt-2 text-gray-500">
              Essayez de modifier vos critères de recherche ou de filtres.
            </p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredClients.map((client, index) => (
              <motion.div
                key={client._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {client.profileImage ? (
                      <img 
                        src={client.profileImage} 
                        alt={client.fullName} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-300"
                      />
                    ) : (
                      <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center">
                        <User size={24} className="text-purple-600" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{client.fullName}</h3>
                          {client.companyName && (
                            <p className="text-purple-600 font-medium">{client.company}</p>
                          )}
                          <p className="text-sm text-gray-500 capitalize">
                            {client.userType}
                          </p>
                        </div>
                        
                        <div className="flex items-center bg-purple-50 text-purple-700 px-2 py-1 rounded-lg">
                          <Star size={16} className="fill-current text-purple-500" />
                          <span className="ml-1 font-bold">{client.rating?.toFixed(1) || '4.5'}</span>
                        </div>
                      </div>
                      
                      {client.services && client.services.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {client.services.slice(0, 3).map(service => (
                            <span 
                              key={service} 
                              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <p className="mt-3 text-gray-600 line-clamp-2">
                        {client.bio || "Client exceptionnel avec un historique de projets réussis."}
                      </p>
                      
                      <div className="mt-4 flex justify-between">
                        <button className="text-purple-600 hover:text-purple-800 font-medium">
                          Voir le profil
                        </button>
                        <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium px-4 py-1 rounded-lg transition-colors">
                          Contacter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ClientsPage;