package net.ngeor.t3.models;

import net.ngeor.t3.settings.HumanPlayerDefinitionImpl;
import net.ngeor.t3.settings.Settings;
import net.ngeor.t3.settings.SettingsImpl;

import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.runners.Enclosed;
import org.junit.runner.RunWith;

import java.util.Arrays;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertSame;

/**
 * Unit tests for ImmutableGameModelImpl.
 *
 * @author ngeor on 10/2/2018.
 */

@RunWith(Enclosed.class)
public class ImmutableGameModelImplTest {

    public static class Draw {
        private Settings settings;

        @Before
        public void before() {
            settings = new SettingsImpl(3, 3, false, Arrays.asList(
                    new HumanPlayerDefinitionImpl(PlayerSymbol.X),
                    new HumanPlayerDefinitionImpl(PlayerSymbol.O)));
        }

        @Test
        public void draw() {
            ImmutableGameModel model = new ImmutableGameModelImpl(settings);
            model = model.immutableStart()
                    .immutablePlay(0, 0)
                    .immutablePlay(1, 0)
                    .immutablePlay(2, 0)
                    .immutablePlay(1, 1)
                    .immutablePlay(0, 1)
                    .immutablePlay(2, 1)
                    .immutablePlay(1, 2)
                    .immutablePlay(0, 2)
                    .immutablePlay(2, 2);
            assertEquals(GameState.Draw, model.getState());
        }
    }

    public static class NewModel {
        private Settings settings;
        private ImmutableGameModel model;

        @Before
        public void before() {
            settings = new SettingsImpl(3, 3, false, Arrays.asList(
                    new HumanPlayerDefinitionImpl(PlayerSymbol.X),
                    new HumanPlayerDefinitionImpl(PlayerSymbol.O)));
            model = new ImmutableGameModelImpl(settings);
        }

        @Test
        public void settingsShouldBeSame() {
            assertSame(settings, model.getSettings());
        }

        @Test
        public void boardModelShouldBeEmpty() {
            BoardModel boardModel = model.getBoardModel();
            assertEquals(3, boardModel.getCols());
            assertEquals(3, boardModel.getRows());
            assertEquals(boardModel.allLocations(), boardModel.emptyLocations());
        }

        @Test
        public void stateShouldBeNotStarted() {
            assertEquals(GameState.NotStarted, model.getState());
        }

        @Test(expected = IllegalStateException.class)
        public void cannotPlayOnNonStartedGame() {
            model.immutablePlay(0, 0);
        }
    }

    public static class StartedModel {
        private Settings settings;
        private ImmutableGameModel model;

        @Before
        public void before() {
            settings = new SettingsImpl(3, 3, false, Arrays.asList(
                    new HumanPlayerDefinitionImpl(PlayerSymbol.X),
                    new HumanPlayerDefinitionImpl(PlayerSymbol.O)));
            model = new ImmutableGameModelImpl(settings);
            model = model.immutableStart();
        }

        @Test
        public void stateShouldBeWaitingForPlayer() {
            assertEquals(GameState.WaitingPlayer, model.getState());
        }

        @Test
        public void turnShouldBePlayerX() {
            assertEquals(PlayerSymbol.X, model.getTurn());
        }

        @Test
        public void canPlay() {
            ImmutableGameModel nextModel = model.immutablePlay(0, 0);
            assertNotNull(nextModel);
            assertEquals(PlayerSymbol.X, model.getTurn());
            assertEquals(PlayerSymbol.O, nextModel.getTurn());
        }
    }
}
