package net.ngeor.t3.models;

import java.util.ArrayList;
import java.util.List;

/**
 * Calculates winning sequences on a board.
 *
 * @author ngeor on 10/2/2018.
 */
public class WinningSequencesProvider {
    public List<List<Location>> calculate(BoardModel model) {
        List<List<Location>> result = new ArrayList<>();
        for (SequenceProvider provider : winningSequenceProviders(model)) {
            result.add(provider.getSequence(model));
        }

        return result;
    }

    private List<SequenceProvider> winningSequenceProviders(BoardModel model) {
        List<SequenceProvider> sequenceProviders = new ArrayList<>();

        // check horizontal matches
        for (int row = 0; row < model.getRows(); row++) {
            sequenceProviders.add(new HorizontalSequenceProvider(row));
        }

        // check vertical matches
        for (int col = 0; col < model.getCols(); col++) {
            sequenceProviders.add(new VerticalSequenceProvider(col));
        }

        // check left-top -> right-bottom diagonal
        sequenceProviders.add(new LeftTopRightBottomSequenceProvider());

        // check left-bottom -> right-top diagonal
        sequenceProviders.add(new LeftBottomRightTopSequenceProvider());
        return sequenceProviders;
    }
}

class HorizontalSequenceProvider implements SequenceProvider {
    private final int row;

    public HorizontalSequenceProvider(int row) {
        this.row = row;
    }

    @Override
    public List<Location> getSequence(BoardModel model) {
        List<Location> result = new ArrayList<>();
        for (int col = 0; col < model.getCols(); col++) {
            result.add(new Location(row, col));
        }

        return result;
    }
}

class VerticalSequenceProvider implements SequenceProvider {
    private final int col;

    public VerticalSequenceProvider(int col) {
        this.col = col;
    }

    @Override
    public List<Location> getSequence(BoardModel model) {
        List<Location> result = new ArrayList<>();
        for (int row = 0; row < model.getRows(); row++) {
            result.add(new Location(row, col));
        }

        return result;
    }
}

class LeftTopRightBottomSequenceProvider implements SequenceProvider {
    @Override
    public List<Location> getSequence(BoardModel model) {
        List<Location> result = new ArrayList<>();
        for (int row = 0; row < model.getRows(); row++) {
            result.add(new Location(row, row));
        }

        return result;
    }
}

class LeftBottomRightTopSequenceProvider implements SequenceProvider {
    @Override
    public List<Location> getSequence(BoardModel model) {
        List<Location> result = new ArrayList<>();
        for (int row = 0; row < model.getRows(); row++) {
            result.add(new Location(model.getRows() - row - 1, row));
        }

        return result;
    }
}
