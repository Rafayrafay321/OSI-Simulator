import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';

// Custom Imports
import { TopologyGraph } from '../../core/TopologyGraph';
import { TopologyNode } from '../../types';
import { AppError } from '../utils/AppError';

export const activeToplogies = new Map<string, TopologyGraph>();

export const createTopology = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { nodes, edges } = req.body;

    if (!nodes || !edges) {
      return next(new AppError(400, 'Bad Request.'));
    }

    const graph = new TopologyGraph();

    nodes.forEach((node: TopologyNode) => {
      graph.addNode(node);
    });

    edges.forEach((edge: [TopologyNode, TopologyNode]) => {
      graph.addEdge(edge[0], edge[1]);
    });

    const topologyId = crypto.randomUUID();
    activeToplogies.set(topologyId, graph);

    res.status(201).json({ status: 'Created', topologyId });
  } catch (error) {
    return next(error);
  }
};

export const getTopology = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const topologyId = req.params.id;

  if (!topologyId) {
    return next(new AppError(400, 'Bad Request.'));
  }

  const requiredTopology = activeToplogies.get(topologyId as string);

  if (!requiredTopology) {
    return next(new AppError(404, 'Topology not found'));
  }

  res.status(200).json({
    status: 'Success',
    TopologyGraph: requiredTopology,
  });
};
