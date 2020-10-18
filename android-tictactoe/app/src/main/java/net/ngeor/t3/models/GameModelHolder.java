package net.ngeor.t3.models;

import net.ngeor.t3.settings.Settings;

import java.util.ArrayList;
import java.util.List;

/**
 * Holds reference to an immutable implementation of a GameModel.
 */
public class GameModelHolder implements MutableGameModel {
    private final List<GameModelListener> listeners = new ArrayList<>();
    private ImmutableGameModel backingModel;

    public void setBackingModel(ImmutableGameModel backingModel) {
        this.backingModel = backingModel;
    }

    @Override
    public void addGameModelListener(GameModelListener gameModelListener) {
        listeners.add(gameModelListener);
    }

    @Override
    public void removeGameModelListener(GameModelListener gameModelListener) {
        listeners.remove(gameModelListener);
    }

    @Override
    public PlayerSymbol getTurn() {
        return backingModel.getTurn();
    }

    @Override
    public GameState getState() {
        return backingModel.getState();
    }

    @Override
    public BoardModel getBoardModel() {
        return backingModel.getBoardModel();
    }

    @Override
    public Settings getSettings() {
        return backingModel.getSettings();
    }

    @Override
    public ImmutableGameModel immutableStart() {
        return backingModel.immutableStart();
    }

    @Override
    public ImmutableGameModel immutablePlay(int row, int col) {
        return backingModel.immutablePlay(row, col);
    }

    @Override
    public void start() {
        if (getState() == GameState.WaitingPlayer) {
            return;
        }

        backingModel = backingModel.immutableStart();
        fireStateChanged();
    }

    @Override
    public void play(int row, int col) {
        backingModel = backingModel.immutablePlay(row, col);
        fireStateChanged();
    }

    private void fireStateChanged() {
        for (GameModelListener listener : listeners) {
            listener.stateChanged(this);
        }
    }
}
