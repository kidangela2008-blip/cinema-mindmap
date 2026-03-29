import { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronRight, BookOpen, Zap, Heart, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TreeNode {
  id: string;
  name: string;
  color?: string;
  details?: string;
  psychology?: string;
  psychologicalAspect?: string;
  schoolOfAwareness?: string;
  events?: string[];
  functions?: string[];
  subbranches?: TreeNode[];
  choice?: string;
  consequence?: string;
  mainChoice?: string;
}

interface ExpandedState {
  [key: string]: boolean;
}

function TreeNode({ node, level = 0, expanded, onToggle }: {
  node: TreeNode;
  level?: number;
  expanded: ExpandedState;
  onToggle: (id: string) => void;
}) {
  const hasChildren = node.subbranches && node.subbranches.length > 0;
  const isExpanded = expanded[node.id];
  const nodeId = `node-${node.id}`;

  const getIcon = (psychology?: string) => {
    if (!psychology) return null;
    if (psychology.includes("Алекситимия") || psychology.includes("эмоц")) {
      return <Heart className="w-4 h-4" />;
    }
    if (psychology.includes("Тревож") || psychology.includes("психич")) {
      return <Brain className="w-4 h-4" />;
    }
    if (psychology.includes("Нарциссизм") || psychology.includes("импульс")) {
      return <Zap className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <div className="mb-2">
      <div
        className="flex items-start gap-2 p-3 rounded-lg transition-all hover:shadow-md"
        style={{
          backgroundColor: node.color ? `${node.color}15` : "transparent",
          borderLeft: node.color ? `4px solid ${node.color}` : "none",
          marginLeft: `${level * 1.5}rem`,
        }}
      >
        {hasChildren && (
          <button
            onClick={() => onToggle(nodeId)}
            className="mt-1 p-0 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {getIcon(node.psychology)}
            <h3 className="font-semibold text-sm md:text-base break-words">{node.name}</h3>
            {node.psychology && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full whitespace-nowrap">
                {node.psychology.split(",")[0]}
              </span>
            )}
          </div>

          {node.details && (
            <p className="text-xs md:text-sm text-gray-600 mt-1">{node.details}</p>
          )}

          {node.mainChoice && (
            <div className="mt-2 p-2 bg-yellow-50 border-l-2 border-yellow-400 rounded">
              <p className="text-xs font-semibold text-yellow-800">Главный выбор:</p>
              <p className="text-xs text-yellow-700">{node.mainChoice}</p>
            </div>
          )}

          {node.choice && (
            <div className="mt-2 p-2 bg-orange-50 border-l-2 border-orange-400 rounded">
              <p className="text-xs font-semibold text-orange-800">Выбор:</p>
              <p className="text-xs text-orange-700">{node.choice}</p>
            </div>
          )}

          {node.psychologicalAspect && (
            <div className="mt-2 p-2 bg-purple-50 border-l-2 border-purple-400 rounded">
              <p className="text-xs font-semibold text-purple-800">Психологический аспект:</p>
              <p className="text-xs text-purple-700">{node.psychologicalAspect}</p>
            </div>
          )}

          {node.schoolOfAwareness && (
            <div className="mt-2 p-2 bg-green-50 border-l-2 border-green-400 rounded">
              <p className="text-xs font-semibold text-green-800">Школа осознанности:</p>
              <p className="text-xs text-green-700">{node.schoolOfAwareness}</p>
            </div>
          )}

          {node.consequence && (
            <div className="mt-2 p-2 bg-red-50 border-l-2 border-red-400 rounded">
              <p className="text-xs font-semibold text-red-800">Последствие:</p>
              <p className="text-xs text-red-700">{node.consequence}</p>
            </div>
          )}

          {node.events && node.events.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-gray-700">События:</p>
              <ul className="text-xs text-gray-600 list-disc list-inside">
                {node.events.map((event: string, idx: number) => (
                  <li key={idx}>{event}</li>
                ))}
              </ul>
            </div>
          )}

          {node.functions && node.functions.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-gray-700">Функции:</p>
              <ul className="text-xs text-gray-600 list-disc list-inside">
                {node.functions.map((func: string, idx: number) => (
                  <li key={idx}>{func}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>
            {node.subbranches?.map((child: TreeNode) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [activeTab, setActiveTab] = useState("characters");
  const [mindmapData, setMindmapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/mindmap-data.json")
      .then((res) => res.json())
      .then((data) => {
        setMindmapData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load mindmap data:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !mindmapData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка интеллект-карты...</p>
        </div>
      </div>
    );
  }

  const toggleNode = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allIds: ExpandedState = {};
    const collectIds = (node: TreeNode) => {
      allIds[`node-${node.id}`] = true;
      node.subbranches?.forEach(collectIds);
    };
    mindmapData.mainBranches.forEach(collectIds);
    setExpanded(allIds);
  };

  const collapseAll = () => {
    setExpanded({});
  };

  const characterStats = useMemo(() => {
    if (!mindmapData) return [];
    return mindmapData.mainBranches.map((char: any) => ({
      name: char.name,
      color: char.color,
      psychology: char.psychology,
      mainChoice: char.mainChoice,
      subbranches: char.subbranches?.length || 0,
    }));
  }, [mindmapData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Интерактивное кино: Mind Map
            </h1>
          </div>
          <p className="text-gray-600">
            Полная структура выборов персонажей, психологических состояний и сюжетных событий
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="characters">Персонажи</TabsTrigger>
            <TabsTrigger value="arcs">Сюжетные линии</TabsTrigger>
            <TabsTrigger value="schools">Школы осознанности</TabsTrigger>
          </TabsList>

          {/* Characters Tab */}
          <TabsContent value="characters" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button onClick={expandAll} variant="outline" size="sm">
                Развернуть всё
              </Button>
              <Button onClick={collapseAll} variant="outline" size="sm">
                Свернуть всё
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {characterStats.map((char: any, idx: number) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: char.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{char.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{char.psychology}</p>
                      <p className="text-xs text-blue-600 font-medium mt-2">
                        Разделов: {char.subbranches}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              {mindmapData.mainBranches.map((branch: any) => (
                <div key={branch.id} className="bg-white rounded-lg shadow-sm p-4">
                  <TreeNode
                    node={branch}
                    level={0}
                    expanded={expanded}
                    onToggle={toggleNode}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Story Arcs Tab */}
          <TabsContent value="arcs" className="space-y-4">
            {mindmapData.storyArcs.map((arc: any) => (
              <Card key={arc.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{arc.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Историческая параллель:</strong> {arc.historicalParallel}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">{arc.characteristics}</p>

                    {arc.events && arc.events.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-800 mb-2">События:</p>
                        <ul className="space-y-1">
                          {arc.events.map((event: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-600 flex gap-2">
                              <span className="text-purple-500">•</span>
                              {event}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {arc.role && (
                      <p className="text-sm text-gray-700 mt-4">
                        <strong>Роль:</strong> {arc.role}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Schools of Awareness Tab */}
          <TabsContent value="schools" className="space-y-4">
            {mindmapData.psychologicalSchools.map((school: any) => (
              <Card key={school.id} className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{school.name}</h3>
                <p className="text-gray-700 mb-4">{school.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-2">Принципы:</p>
                    <ul className="space-y-1">
                      {school.principles.map((principle: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-green-500">✓</span>
                          {principle}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-2">Персонажи:</p>
                    <ul className="space-y-1">
                      {school.characters.map((char: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600">
                          • {char}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {school.challenges && school.challenges.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm font-semibold text-red-800 mb-2">Вызовы:</p>
                    <ul className="space-y-1">
                      {school.challenges.map((challenge: string, idx: number) => (
                        <li key={idx} className="text-sm text-red-700 flex gap-2">
                          <span>⚠</span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Timeline Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Временная линия событий</h2>
          <div className="space-y-6">
            {mindmapData.timelineEvents.map((timeline: any, idx: number) => (
              <div key={idx} className="relative pl-6 border-l-2 border-purple-300">
                <div className="absolute -left-3 w-4 h-4 bg-purple-500 rounded-full" />
                <h3 className="text-lg font-semibold text-gray-900">{timeline.period}</h3>
                <ul className="mt-2 space-y-1">
                  {timeline.events.map((event: string, eventIdx: number) => (
                    <li key={eventIdx} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-purple-500">→</span>
                      {event}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Key Choices Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ключевые выборы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mindmapData.keyChoices.map((choice: any) => (
              <Card key={choice.id} className="p-4 border-l-4" style={{
                borderLeftColor: mindmapData.mainBranches.find((b: any) => b.name.includes(choice.character))?.color || "#999"
              }}>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{choice.character}</p>
                    <p className="text-xs text-gray-500 mt-1">{choice.moment}</p>
                    <p className="text-sm text-gray-700 mt-2 font-medium">{choice.choice}</p>
                    <p className="text-xs text-gray-600 mt-2">
                      <strong>Последствие:</strong> {choice.consequence}
                    </p>
                    {choice.psychologicalAspect && (
                      <p className="text-xs text-purple-600 mt-2">
                        <strong>Психология:</strong> {choice.psychologicalAspect}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Легенда цветов</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mindmapData.mainBranches.map((branch: any) => (
              <div key={branch.id} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: branch.color }}
                />
                <span className="text-sm text-gray-700">{branch.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>Mind Map для проекта интерактивного кино</p>
          <p className="mt-2 text-gray-500">
            Включает все выборы персонажей, психологические аспекты и сюжетные события
          </p>
        </div>
      </footer>
    </div>
  );
}
