package net.ngeor.t3.ai;

import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.ImmutableGameModel;
import net.ngeor.t3.models.Location;
import net.ngeor.t3.models.PlayerSymbol;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MinimaxMovesPicker implements MovesPicker {
    private final PlayerSymbol me;
    private final int minimaxDepth;
    private final Cancellable cancellable;

    public MinimaxMovesPicker(Cancellable cancellable, GameModel model, int minimaxDepth) {
        this.cancellable = cancellable;
        this.me = model.getTurn();
        this.minimaxDepth = minimaxDepth;
    }

    @Override
    public List<Location> pickMoves(ImmutableGameModel model) {
        MinimaxNode startingNode = new MinimaxNode(model, null, me);
        int bestScore = minimax(startingNode, minimaxDepth, true);
        if (cancellable.isCancelled()) {
            return Collections.emptyList();
        }

        // collect matching nodes
        List<MinimaxNode> bestMoves = new ArrayList<>();
        for (MinimaxNode child : startingNode.children()) {
            if (child.getScore() == bestScore) {
                bestMoves.add(child);
            }
        }

        // make sure we have at least one move
        if (bestMoves.isEmpty()) {
            bestMoves.add(startingNode.children().get(0));
        }

        List<Location> result = new ArrayList<>();
        for (MinimaxNode node : bestMoves) {
            result.add(node.getPreviousMove());
        }

        return result;
    }

    private int minimax(MinimaxNode node, int depth, boolean maximizingPlayer) {
        int bestValue;

        if (cancellable.isCancelled()) {
            return 0;
        }

        if (depth == 0 || node.isTerminal()) {
            bestValue = node.heuristic();
        } else {
            int v;
            if (maximizingPlayer) {
                bestValue = Integer.MIN_VALUE;
                for (MinimaxNode child : node.children()) {
                    v = minimax(child, depth - 1, false);
                    bestValue = Math.max(bestValue, v);
                }

            } else {
                bestValue = Integer.MAX_VALUE;
                for (MinimaxNode child : node.children()) {
                    v = minimax(child, depth - 1, true);
                    bestValue = Math.min(bestValue, v);
                }
            }
        }

        node.setScore(bestValue);
        return bestValue;
    }
}

