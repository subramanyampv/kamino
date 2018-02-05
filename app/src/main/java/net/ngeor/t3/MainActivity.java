package net.ngeor.t3;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import net.ngeor.t3.models.GameDto;
import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.GameState;
import net.ngeor.t3.players.AIPlayer;
import net.ngeor.t3.players.HumanPlayer;
import net.ngeor.t3.settings.AIPlayerDefinition;
import net.ngeor.t3.settings.HumanPlayerDefinition;
import net.ngeor.t3.settings.PlayerDefinition;
import net.ngeor.t3.settings.Settings;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity implements MainActivityView {
    private final CompositeTouchListener boardTouchListener = new CompositeTouchListener();
    private final List<AIPlayer> aiPlayers = new ArrayList<>();
    private final List<HumanPlayer> humanPlayers = new ArrayList<>();

    // model
    private GameModel model;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // load UI
        setContentView(R.layout.activity_main);
        getBoardView().setOnTouchListener(boardTouchListener);

        // set default preferences
        PreferenceManager.setDefaultValues(this, R.xml.preferences, false);

        // restore model
        if (savedInstanceState != null) {
            StateManager stateManager = new StateManager(savedInstanceState);
            GameDto savedGameState = stateManager.getGame();
            model = new GameModel(savedGameState);
        } else {
            model = createGameModel();
        }

        getBoardView().setModel(model);
        GameListener gameListener = new GameListener(this, model);
        model.addGameModelListener(gameListener);

        createPlayers();

        if (model.getState() == GameState.NotStarted) {
            model.start();
        } else {
            // when resuming after device orientation changes,
            // the text needs to be refreshed
            gameListener.updateHeaderText();
        }
    }

    private void createPlayers() {
        destroyPlayers();

        Settings settings = model.getSettings();
        for (PlayerDefinition playerDefinition : settings.getPlayerDefinitions()) {
            if (playerDefinition instanceof HumanPlayerDefinition) {
                // create touch listener
                createHumanPlayer(playerDefinition);
            } else if (playerDefinition instanceof AIPlayerDefinition) {
                createAIPlayer(playerDefinition);
            } else {
                throw new IllegalArgumentException("Cannot create player");
            }
        }
    }

    private void createHumanPlayer(PlayerDefinition playerDefinition) {
        HumanPlayer humanPlayer = new HumanPlayer(this, model, playerDefinition.getPlayerSymbol());
        boardTouchListener.addListener(humanPlayer);
        model.addGameModelListener(humanPlayer);
        humanPlayers.add(humanPlayer);
    }

    private void createAIPlayer(PlayerDefinition playerDefinition) {
        AIPlayer aiPlayer = new AIPlayer(
                msg -> Toast.makeText(this, msg, Toast.LENGTH_SHORT).show(),
                model,
                playerDefinition.getPlayerSymbol());
        model.addGameModelListener(aiPlayer);
        aiPlayers.add(aiPlayer);
    }

    private void destroyPlayers() {
        destroyAIPlayers();
        destroyHumanPlayers();
    }

    private void destroyHumanPlayers() {
        for (HumanPlayer humanPlayer : humanPlayers) {
            destroyHumanPlayer(humanPlayer);
        }

        humanPlayers.clear();
    }

    private void destroyAIPlayers() {
        for (AIPlayer aiPlayer : aiPlayers) {
            destroyAIPlayer(aiPlayer);
        }

        aiPlayers.clear();
    }

    private void destroyHumanPlayer(HumanPlayer humanPlayer) {
        boardTouchListener.removeListener(humanPlayer);
        model.removeGameModelListener(humanPlayer);
    }

    private void destroyAIPlayer(AIPlayer aiPlayer) {
        aiPlayer.cancel();
        model.removeGameModelListener(aiPlayer);
    }

    @Override
    protected void onResume() {
        super.onResume();

        // TODO: if settings changed, do something
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        StateManager stateManager = new StateManager(outState);
        stateManager.setGame(new GameDto(model));
    }

    @Override
    public void setHeaderText(int resourceId) {
        getHeaderView().setText(resourceId);
    }

    @Override
    public void invalidateBoardView() {
        getBoardView().invalidate();
    }

    private BoardView getBoardView() {
        return (BoardView) findViewById(R.id.board);
    }

    private TextView getHeaderView() {
        return (TextView) findViewById(R.id.header);
    }

    private GameModel createGameModel() {
        Settings settings = createSettings();
        return new GameModel(settings);
    }

    private SharedPreferences createSharedPreferences() {
        return PreferenceManager.getDefaultSharedPreferences(this);
    }

    private Settings createSettings() {
        SharedPreferences sharedPreferences = createSharedPreferences();
        net.ngeor.t3.settings.preferences.SettingsImpl preferenceSettings = new net.ngeor.t3.settings.preferences.SettingsImpl(sharedPreferences);
        net.ngeor.t3.settings.serializable.SettingsImpl serializableSettings = new net.ngeor.t3.settings.serializable.SettingsImpl(preferenceSettings);
        return serializableSettings;
    }

    public void onRestartClick(View view) {
        model.restart(createSettings());
        createPlayers();
        model.start();
    }

    public void onSettingsClick(View view) {
        Intent intent = new Intent(MainActivity.this, SettingsActivity.class);
        startActivity(intent);
    }
}
