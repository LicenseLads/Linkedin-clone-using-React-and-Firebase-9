import React, { useEffect, useState } from "react";
import ProjectCard from "../ProjectCard";
import { doc, getDoc } from "firebase/firestore";
import "./index.scss";

export default function ProjectCardList({ projects }) {
  const [authorsMap, setAuthorsMap] = useState({});

  // 1. Adunăm toate ID-urile diferite de autor
  useEffect(() => {
    if (!projects || projects.length === 0) return;

    // extragem doar campul "author" din fiecare proiect
    const allAuthorIds = projects.map((p) => p.author).filter(Boolean);
    const uniqueAuthorIds = [...new Set(allAuthorIds)];

    // dacă n-avem niciun author, nu facem nimic
    if (uniqueAuthorIds.length === 0) return;

    // încărcăm userii pt fiecare authorId
    const fetchAllAuthors = async () => {
      let tempMap = {};
      for (const authorId of uniqueAuthorIds) {
        try {
          const docRef = doc(firestore, "users", authorId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            tempMap[authorId] = { id: snap.id, ...snap.data() };
          }
        } catch (err) {
          console.error("Eroare la fetch user:", err);
        }
      }
      setAuthorsMap(tempMap);
    };

    fetchAllAuthors();
  }, [projects]);

  // 2. Randăm ProjectCard
  return (
    <div className="project-card-list">
      {projects.map((project) => {
        const authorData = authorsMap[project.author] || null;
        return (
          <ProjectCard
            key={project.id}
            id={project.id}
            name={project.name}
            authorData={authorData}
            status={project.status}
            label={project.label}  
            createdAt={project.created_at}
            updatedAt={project.updated_at}
            description={project.description}
          />
        );
      })}
    </div>
  );
}
