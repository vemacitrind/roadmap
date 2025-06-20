import React, { useEffect, useState, useRef } from "react";
import Tree from "react-d3-tree";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";



export default function RoadmapTree({ category = "role-based", roadmapId = "frontend" }) {
    const [treeData, setTreeData] = useState(null);
    const treeContainerRef = useRef(null);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const collectionRef = collection(db, "roadmaps", category, roadmapId);
                const snapshot = await getDocs(collectionRef);

                if (!snapshot.empty) {
                    const docSnap = snapshot.docs[0];
                    const data = docSnap.data();


                    if (data.tree) {
                        setTreeData(data.tree);
                    } else {
                        console.warn("⚠️ 'tree' field missing in first doc.");
                    }
                } else {
                    console.warn("⚠️ No documents found in:", category, roadmapId);
                }
            } catch (err) {
                console.error("🚨 Firestore fetch error:", err);
            }
        };

        fetchData();
    }, [category, roadmapId]);

    useEffect(() => {
        if (treeContainerRef.current) {
            const { width } = treeContainerRef.current.getBoundingClientRect();
            setTranslate({ x: width / 2, y: 60 });
        }
    }, []);

    return (
        <div ref={treeContainerRef}
            className="w-[100vw] h-[85vh] p-4 border rounded bg-white"
        >
            {treeData ? (
                <Tree
                    data={treeData}
                    translate={translate}
                    orientation="vertical"
                    collapsible={false}
                    zoomable={false}
                    panOnDrag={false}
                    draggable={false}
                    enableLegacyTransitions={false}
                    separation={{ siblings: 1.2, nonSiblings: 2 }}
                    renderCustomNodeElement={({ nodeDatum }) => {
                        const padding = 28;
                        const charWidth = 12;
                        const nameLength = nodeDatum.name?.length || 0;
                        const rectWidth = nameLength * charWidth + padding;

                        return (
                            <g>
                                <rect
                                    x={-rectWidth / 2}
                                    y={-20}
                                    rx={10}
                                    ry={10}
                                    width={rectWidth}
                                    height={40}
                                    fill={nodeDatum.children ? "#18181b" : "#52525b"}
                                    stroke="#1F2937"
                                    strokeWidth={2}
                                />
                                <text
                                    x={0}
                                    y={5}
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    fill="#fafafa"
                                    stroke="none"
                                    fontSize={20}
                                    fontFamily="sans-serif"
                                >
                                    {nodeDatum.name}
                                </text>
                            </g>
                        );
                    }}
                    
                />

            ) : (
            <p className="text-center text-gray-600">Loading roadmap...</p>
            )}
        </div>
    );
}
