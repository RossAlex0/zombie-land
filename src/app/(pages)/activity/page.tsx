'use client';

import useFetch from '@hooks/api-request/useFetch';
import { category } from '@prismaInstance/*';
import Loading from '../../loading';
import { ActivityWithCategory } from '@customTypes/collections/activity';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import { useCallback, useMemo, useState } from 'react';
import ActivityCard from '@components/block/card/ActivityCard';
import Link from 'next/link';
import Chips from '@components/ui/chips/Chips';
import SearchInput from '@components/ui/input/search-input/SearchInput';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import './activity.scss';

export default function ActivitiesPage() {
  const {
    data: activities,
    loading: loadingActivity,
    error: errorActivity,
  } = useFetch<ActivityWithCategory[]>('/api/activity');

  const {
    data: categories,
    loading: loadingCatgeory,
    error: errorCatgeory,
  } = useFetch<category[]>('/api/category');

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [inputSearch, setInputSearch] = useState<string | null>(null);

  const filteredActivities = useMemo(() => {
    if (!activities) return [];

    const search = inputSearch?.trim().toLowerCase() ?? '';

    return activities.filter((a) => {
      const matchCategory =
        selectedCategories.length === 0 ||
        a.category_activity.some((c) => selectedCategories.includes(c.category.id));

      const matchSearch = search === '' || a.name.toLowerCase().includes(search);

      return matchCategory && matchSearch;
    });
  }, [activities, inputSearch, selectedCategories]);

  const handleClickChips = useCallback((id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  }, []);

  if (loadingActivity || loadingCatgeory) {
    return <Loading />;
  }

  if (errorActivity || errorCatgeory) {
    throw new Error('Erreur durant la récupération des données sur la page ( /activity )');
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="activity_no_data">
        <TextZbl tag="h1">Aucune activités trouvées</TextZbl>
        <ButtonZbl navTo="/">Retour à la page d&apos;accueil</ButtonZbl>
      </div>
    );
  }

  return (
    <section className="activity">
      <div className="activity_header">
        <div className="activity_header_title">
          <TextZbl tag="h1" color="red">
            <span>
              <span className="activity_white">{activities.length}</span> attraction
              {activities.length > 1 ? 's' : ''} <br /> une seule règle survivre...
            </span>
          </TextZbl>
        </div>
        <div className="activity_header_desc">
          <TextZbl jetbrains>
            &quot;Bienvenue dans la zone de survie. Explorez nos activités, relevez des missions
            périlleuses et plongez au cœur d&apos;une aventure zombie immersive où courage,
            stratégie et esprit d&apos;équipe seront vos meilleures armes.&quot;
          </TextZbl>
        </div>
      </div>
      <div className="activity_search">
        <div className="activity_search_input">
          <SearchInput value={inputSearch} onChange={setInputSearch} />
        </div>
        <div className="activity_search_chips">
          {categories && categories.length > 0
            ? categories.map((category) => (
                <Chips
                  key={category.id}
                  category={category}
                  isActive={selectedCategories.some((c) => c === category.id)}
                  onClick={(id) => handleClickChips(id)}
                />
              ))
            : undefined}
        </div>
      </div>
      <div className="activity_content">
        {filteredActivities.map((act) => (
          <Link key={act.id} href={`/activity/${act.id}`} className="activity_content_card">
            <ActivityCard activity={act} />
          </Link>
        ))}
      </div>
    </section>
  );
}
