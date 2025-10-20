import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import RouteCard from "@/components/RouteCard";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { searchTrips } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const agencies = [
  "Trans-Sahel Express",
  "Premium Voyages",
  "Budget Trans",
  "Express Route",
  "West African Tours",
];

const departureTimes = [
  { id: "matin", label: "Matin (6h - 12h)" },
  { id: "apres-midi", label: "Après-midi (12h - 18h)" },
  { id: "soir", label: "Soir (18h - 00h)" },
];

const getDeparturePeriod = (time) => {
  const hour = parseInt(time.split(":")[0], 10);
  if (hour >= 6 && hour < 12) return "matin";
  if (hour >= 12 && hour < 18) return "apres-midi";
  return "soir";
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedAgencies, setSelectedAgencies] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [minRating, setMinRating] = useState(0);

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const searchResult = await searchTrips({ from, to });
        setResults(searchResult);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur de recherche",
          description: "Impossible de récupérer les voyages. Veuillez réessayer plus tard.",
        });
        setResults([]); // Clear previous results on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [searchParams, toast]);

  const filteredResults = useMemo(() => {
    return results.filter((trip) => {
      const price = parseInt(trip.price.replace(/,/g, ""), 10);
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }
      if (minRating > 0 && trip.rating < minRating) {
        return false;
      }
      if (selectedAgencies.length > 0 && !selectedAgencies.includes(trip.agency)) {
        return false;
      }
      if (selectedTimes.length > 0) {
        const period = getDeparturePeriod(trip.departureTime);
        if (!selectedTimes.includes(period)) {
          return false;
        }
      }
      return true;
    });
  }, [results, priceRange, selectedAgencies, selectedTimes, minRating]);

  const handleAgencyChange = (agency) => {
    setSelectedAgencies((prev) =>
      prev.includes(agency)
        ? prev.filter((a) => a !== agency)
        : [...prev, agency]
    );
  };

  const handleTimeChange = (timeId) => {
    setSelectedTimes((prev) =>
      prev.includes(timeId) ? prev.filter((t) => t !== timeId) : [...prev, timeId]
    );
  };

  const handleClearFilters = () => {
    setPriceRange([0, 50000]);
    setSelectedAgencies([]);
    setSelectedTimes([]);
    setMinRating(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Search Bar */}
      <section className="bg-muted/30 py-6">
        <div className="container mx-auto px-4">
          <SearchBar variant="compact" />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block w-80 space-y-6">
              <div className="bg-card p-6 rounded-xl shadow-card sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Filtres</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={handleClearFilters}
                  >
                    Tout effacer
                  </Button>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Fourchette de prix (CFA)</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50000}
                    step={1000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{priceRange[0].toLocaleString()}</span>
                    <span>{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Departure Time */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Heure de départ</h4>
                  <div className="space-y-2">
                    {departureTimes.map((time) => (
                      <div key={time.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={time.id}
                          checked={selectedTimes.includes(time.id)}
                          onCheckedChange={() => handleTimeChange(time.id)}
                        />
                        <label htmlFor={time.id} className="text-sm cursor-pointer">
                          {time.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agencies */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Agences de transport</h4>
                  <div className="space-y-2">
                    {agencies.map((agency) => (
                      <div key={agency} className="flex items-center space-x-2">
                        <Checkbox
                          id={agency}
                          checked={selectedAgencies.includes(agency)}
                          onCheckedChange={() => handleAgencyChange(agency)}
                        />
                        <label htmlFor={agency} className="text-sm cursor-pointer">
                          {agency}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="font-medium mb-3">Note minimale</h4>
                  <Slider
                    value={[minRating]}
                    onValueChange={(value) => setMinRating(value[0])}
                    max={5}
                    step={0.5}
                  />
                  <div className="text-sm text-muted-foreground mt-2">
                    {minRating.toFixed(1)} et plus
                  </div>
                </div>
              </div>
            </aside>

            {/* Results List */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {from && to
                      ? `${from} → ${to}`
                      : "Tous les voyages disponibles"}
                  </h2>
                  <p className="text-muted-foreground">
                    {isLoading
                      ? "Recherche en cours..."
                      : `${filteredResults.length} voyages trouvés`}
                  </p>
                </div>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </div>

              <div className="grid gap-6">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex space-x-4 rounded-xl border p-4"
                    >
                      <Skeleton className="h-32 w-48 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-3/5" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex justify-end pt-4">
                          <Skeleton className="h-10 w-28" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : filteredResults.length > 0 ? (
                  filteredResults.map((result, idx) => (
                    <RouteCard key={idx} {...result} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold">Aucun résultat</h3>
                    <p className="text-muted-foreground">
                      Essayez de modifier ou de réinitialiser vos filtres.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Chatbot />
    </div>
  );
};

export default SearchResults;
